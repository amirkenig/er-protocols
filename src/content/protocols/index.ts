/**
 * All protocols, validated at module load. Add each new protocol file here.
 * A schema error throws at startup and fails the content test suite.
 */
import { ProtocolSchema, type Protocol, type ProtocolInput } from "../schema";
import { cardiacArrest } from "./resuscitation/cardiac-arrest";
import { bradycardia } from "./resuscitation/bradycardia";
import { potassiumDisorders } from "./electrolytes/potassium-disorders";
import { anaphylaxis } from "./shock/anaphylaxis";
import { highRiskPe } from "./shock/high-risk-pe";
import { traumaticArrest } from "./shock/traumatic-arrest";
import { lastToxicity } from "./toxicology/last-toxicity";
import { accidentalHypothermia } from "./environmental/accidental-hypothermia";
import { hyperthermia } from "./environmental/hyperthermia";

const RAW: readonly ProtocolInput[] = [
  cardiacArrest,
  bradycardia,
  potassiumDisorders,
  anaphylaxis,
  highRiskPe,
  traumaticArrest,
  lastToxicity,
  accidentalHypothermia,
  hyperthermia,
];

export const PROTOCOLS: readonly Protocol[] = RAW.map((p) => ProtocolSchema.parse(p)).filter(
  (p) => !p.isFixture,
);
