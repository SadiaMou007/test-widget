import DMWidgets from "./index";
import { createRoot } from "react-dom/client";
import React from "react";
import { initI18n, type SupportedLocale } from "./i18n";
import App from "./demo/App";

// Re-export for IIFE global exposure via tsup --global-name DMWidgets
export default DMWidgets;

// Also attach to window for safety when loaded dynamically
declare global {
  interface Window {
    DMWidgets: typeof DMWidgets;
  }
}
(window as any).DMWidgets = DMWidgets;

export type MountOptions = {
  locale?: SupportedLocale;
};

function mount(
  selectorOrEl: string | HTMLElement,
  options: MountOptions = {}
): void {
  const element =
    typeof selectorOrEl === "string"
      ? document.querySelector(selectorOrEl)
      : selectorOrEl;
  if (!element) throw new Error("Mount target not found");
  initI18n(options.locale ?? "en");
  const root = createRoot(element as HTMLElement);
  root.render(React.createElement(App));
}

declare global {
  interface Window {
    DMApp: { mount: typeof mount };
  }
}

(window as any).DMApp = { mount };
