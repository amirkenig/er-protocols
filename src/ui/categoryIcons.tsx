import type { ComponentType } from "react";
import { ClipboardList, Bug, Droplets, FlaskConical, HeartPulse, LungsIcon } from "./icons";

interface IconProps {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

interface CategoryStyle {
  Icon: ComponentType<IconProps>;
  fg: string;
  bg: string;
}

const FALLBACK: CategoryStyle = {
  Icon: ClipboardList,
  fg: "text-icon-blue",
  bg: "bg-icon-blue-bg",
};

const STYLES: Record<string, CategoryStyle> = {
  resuscitation: { Icon: HeartPulse, fg: "text-icon-rose", bg: "bg-icon-rose-bg" },
  airway: { Icon: LungsIcon, fg: "text-icon-violet", bg: "bg-icon-violet-bg" },
  ahf: { Icon: Droplets, fg: "text-icon-blue", bg: "bg-icon-blue-bg" },
  sepsis: { Icon: Bug, fg: "text-icon-amber", bg: "bg-icon-amber-bg" },
  electrolytes: { Icon: FlaskConical, fg: "text-icon-green", bg: "bg-icon-green-bg" },
};

export function categoryStyle(id: string): CategoryStyle {
  return STYLES[id] ?? FALLBACK;
}

export function CategoryIcon({
  id,
  size = 24,
  circle = "size-12",
}: {
  id: string;
  size?: number;
  circle?: string;
}) {
  const { Icon, fg, bg } = categoryStyle(id);
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${circle} ${bg} ${fg}`}
    >
      <Icon size={size} aria-hidden="true" />
    </span>
  );
}
