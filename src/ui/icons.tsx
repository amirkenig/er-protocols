export {
  Activity,
  BookOpen,
  Bug,
  Calculator,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Droplets,
  FlaskConical,
  Gauge,
  HeartPulse,
  House,
  Play,
  Repeat,
  Search,
  Settings,
  Stethoscope,
  Syringe,
  Timer,
  TriangleAlert,
  Wrench,
  X,
} from "lucide-react";

interface LungsIconProps {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

/** Hand-drawn lungs (trachea + two lobes), same props shape as the lucide icons. */
export function LungsIcon({ size = 24, className, "aria-hidden": ariaHidden }: LungsIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden ?? "true"}
    >
      <path d="M12 3v8" />
      <path d="M12 11c-1.5 0-3 1-3 2" />
      <path d="M12 11c1.5 0 3 1 3 2" />
      <path d="M9 8C6 8 4 12 4 16c0 2.5 1 4 3 4 1.5 0 2-1 2-2.5V13" />
      <path d="M15 8c3 0 5 4 5 8 0 2.5-1 4-3 4-1.5 0-2-1-2-2.5V13" />
    </svg>
  );
}
