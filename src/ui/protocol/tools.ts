import { he } from "../i18n/he";

export interface ProtocolTool {
  to: string;
  label: string;
}

/** Tool pages linked from a protocol page, keyed by protocol id. */
export const PROTOCOL_TOOLS: Readonly<Record<string, readonly ProtocolTool[]>> = {
  "cardiac-arrest": [{ to: "/code", label: he.protocol.openCodeTimer }],
};
