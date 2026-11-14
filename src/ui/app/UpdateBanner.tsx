import { useRegisterSW } from "virtual:pwa-register/react";
import { he } from "../i18n/he";

export function UpdateBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  if (!needRefresh) return null;
  return (
    <div
      role="status"
      className="flex items-center justify-between gap-3 bg-primary px-4 py-2 text-on-primary"
    >
      <span className="font-bold">{he.update.available}</span>
      <button
        type="button"
        className="min-h-12 rounded-full bg-on-primary px-4 font-bold text-primary"
        onClick={() => {
          void updateServiceWorker(true);
        }}
      >
        {he.update.refresh}
      </button>
    </div>
  );
}
