import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.erprotocols.app",
  appName: "פרוטוקולים לרפואה דחופה",
  webDir: "dist",
  android: {
    // All content is bundled in the APK; the app makes no network requests.
    allowMixedContent: false,
  },
};

export default config;
