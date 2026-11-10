import { Link, useParams } from "react-router";
import { PROTOCOL_STUBS } from "../../content/registry";
import { he } from "../i18n/he";

export function ProtocolPage() {
  const { protocolId } = useParams();
  const stub = PROTOCOL_STUBS.find((p) => p.id === protocolId);
  if (!stub) return <p className="text-lg">{he.protocol.notFound}</p>;
  return (
    <div className="space-y-3">
      <Link to={`/c/${stub.categoryId}`} className="flex min-h-12 items-center text-accent underline">
        {he.back}
      </Link>
      <h1 className="text-2xl font-bold">{stub.titleHe}</h1>
      <p className="text-lg">{he.protocol.placeholder}</p>
    </div>
  );
}
