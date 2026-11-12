# Explainer narration (English voice-over)

The explainer animations play pre-generated narration audio so they work fully offline.

- Scripts: `src/content/explainers/explainers.json` (one entry per explainer, one narration
  text per scene, with citations).
- Generated: `public/explainers/<id>.m4a` and `src/content/explainers/timings.json`
  (scene and sentence timings, plus a SHA-256 of each narration text).
- A content test fails if a narration text changes without regenerating the audio.

## Regenerate after editing a narration

1. Install Piper (offline neural TTS, from PyPI):
   `python3 -m venv .venv-tts && .venv-tts/bin/pip install piper-tts==1.8.0`
2. Download the voice (public-domain LJSpeech dataset) from the official Piper voices repo:
   `https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ljspeech/high/en_US-ljspeech-high.onnx`
   and `en_US-ljspeech-high.onnx.json` next to it.
   SHA-256 of the `.onnx`: `5d4f08ba6a2a48c44592eed3ce56bf85e9de3dd4e20df90541ae68a8310c029a`.
3. Run (needs `ffmpeg` on PATH):
   `PIPER_BIN=.venv-tts/bin/piper PIPER_MODEL=path/to/en_US-ljspeech-high.onnx python3 scripts/narration/build_narration.py`

Write numbers and abbreviations the way they should be spoken (e.g. "P E A", "one milligram").
Clinical content in narration must match the protocol content and its citations.
Drug-mechanism explainers are general educational pharmacology and stay `unverified`
until a clinician reviews them.
