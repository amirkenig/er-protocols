/**
 * Protocols shown in the app, validated at module load. Hidden (kept, not registered):
 * anaphylaxis, high-risk-pe, last-toxicity, accidental-hypothermia, hyperthermia —
 * add the import and the RAW entry back to show one again.
 *
 * All protocols, validated at module load. Add each new protocol file here.
 * A schema error throws at startup and fails the content test suite.
 */
import { ProtocolSchema, type Protocol, type ProtocolInput } from "../schema";
import { cardiacArrest } from "./resuscitation/cardiac-arrest";
import { bradycardia } from "./resuscitation/bradycardia";
import { tachycardia } from "./resuscitation/tachycardia";
import { postRoscCare } from "./resuscitation/post-rosc-care";
import { hyperkalaemia } from "./electrolytes/hyperkalaemia";
import { traumaticArrest } from "./shock/traumatic-arrest";
import { sepsis } from "./sepsis/sepsis";

const RAW: readonly ProtocolInput[] = [
  cardiacArrest,
  bradycardia,
  tachycardia,
  postRoscCare,
  hyperkalaemia,
  traumaticArrest,
  sepsis,
];

export const PROTOCOLS: readonly Protocol[] = RAW.map((p) => ProtocolSchema.parse(p)).filter(
  (p) => !p.isFixture,
);
