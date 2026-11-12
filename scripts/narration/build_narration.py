#!/usr/bin/env python3
"""
Build English narration audio + timings for the explainer animations.

Reads  src/content/explainers/explainers.json
Writes public/explainers/<explainer-id>.m4a        (AAC, mono, offline in the app)
       src/content/explainers/timings.json         (scene + sentence start/end ms,
                                                    and a SHA-256 of each narration text
                                                    so tests can detect stale audio)

Requirements (not committed — see docs/narration.md):
  PIPER_BIN   path to the `piper` executable (pip install piper-tts==1.8.0)
  PIPER_MODEL path to en_US-ljspeech-high.onnx (public-domain LJSpeech voice,
              SHA-256 5d4f08ba6a2a48c44592eed3ce56bf85e9de3dd4e20df90541ae68a8310c029a)
  ffmpeg on PATH

Run: PIPER_BIN=... PIPER_MODEL=... python3 scripts/narration/build_narration.py
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import wave

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "src", "content", "explainers", "explainers.json")
TIMINGS = os.path.join(ROOT, "src", "content", "explainers", "timings.json")
OUT_DIR = os.path.join(ROOT, "public", "explainers")

LEAD_IN_MS = 600       # silence before the first scene
SENTENCE_GAP_MS = 250  # pause between sentences in a scene
SCENE_GAP_MS = 700     # pause between scenes
TAIL_MS = 1200         # silence after the last scene
LENGTH_SCALE = "1.08"  # slightly slower than default, for clarity
RATE = 22050


def sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.?!])\s+", text.strip())
    return [p for p in parts if p]


def synth(piper: str, model: str, text: str, path: str) -> int:
    subprocess.run(
        [piper, "-m", model, "--length-scale", LENGTH_SCALE, "-f", path],
        input=text.encode("utf-8"),
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    with wave.open(path, "rb") as w:
        assert w.getframerate() == RATE and w.getnchannels() == 1 and w.getsampwidth() == 2
        return w.getnframes()


def silence(ms: int) -> bytes:
    return b"\x00\x00" * (RATE * ms // 1000)


def main() -> None:
    piper = os.environ.get("PIPER_BIN")
    model = os.environ.get("PIPER_MODEL")
    if not piper or not model:
        sys.exit("Set PIPER_BIN and PIPER_MODEL (see docs/narration.md)")
    data = json.load(open(SRC, encoding="utf-8"))
    os.makedirs(OUT_DIR, exist_ok=True)
    timings: dict = {}
    with tempfile.TemporaryDirectory() as tmp:
        for ex in data["explainers"]:
            pcm = bytearray(silence(LEAD_IN_MS))
            t = LEAD_IN_MS
            scenes_out = []
            for si, scene in enumerate(data_scenes(ex)):
                if si > 0:
                    pcm += silence(SCENE_GAP_MS)
                    t += SCENE_GAP_MS
                scene_start = t
                sents_out = []
                for i, sent in enumerate(sentences(scene["narration"])):
                    if i > 0:
                        pcm += silence(SENTENCE_GAP_MS)
                        t += SENTENCE_GAP_MS
                    wav = os.path.join(tmp, f"{ex['id']}-{scene['id']}-{i}.wav")
                    frames = synth(piper, model, sent, wav)
                    with wave.open(wav, "rb") as w:
                        pcm += w.readframes(frames)
                    dur = frames * 1000 // RATE
                    sents_out.append({"text": sent, "startMs": t, "endMs": t + dur})
                    t += dur
                scenes_out.append(
                    {
                        "id": scene["id"],
                        "startMs": scene_start,
                        "endMs": t,
                        "sentences": sents_out,
                        "textSha256": hashlib.sha256(scene["narration"].encode("utf-8")).hexdigest(),
                    }
                )
            pcm += silence(TAIL_MS)
            t += TAIL_MS
            full = os.path.join(tmp, f"{ex['id']}.wav")
            with wave.open(full, "wb") as w:
                w.setnchannels(1)
                w.setsampwidth(2)
                w.setframerate(RATE)
                w.writeframes(bytes(pcm))
            out = os.path.join(OUT_DIR, f"{ex['id']}.m4a")
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-i", full, "-c:a", "aac", "-b:a", "48k", "-ac", "1", out],
                check=True,
            )
            timings[ex["id"]] = {"durationMs": t, "audio": f"explainers/{ex['id']}.m4a", "scenes": scenes_out}
            print(f"{ex['id']}: {t / 1000:.1f} s, {os.path.getsize(out) // 1024} KB")
    with open(TIMINGS, "w", encoding="utf-8") as f:
        json.dump(timings, f, ensure_ascii=False, indent=2)
        f.write("\n")


def data_scenes(ex: dict) -> list:
    return ex["scenes"]


if __name__ == "__main__":
    main()
