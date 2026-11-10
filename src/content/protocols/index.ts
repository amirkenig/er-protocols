/**
 * All protocols, validated at module load. Add each new protocol file here.
 * A schema error throws at startup and fails the content test suite.
 */
import { ProtocolSchema, type Protocol, type ProtocolInput } from "../schema";
import { cardiacArrest } from "./resuscitation/cardiac-arrest";

const RAW: readonly ProtocolInput[] = [cardiacArrest];

export const PROTOCOLS: readonly Protocol[] = RAW.map((p) => ProtocolSchema.parse(p)).filter(
  (p) => !p.isFixture,
);
