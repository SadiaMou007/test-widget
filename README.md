# Deemoney Framer Widgets

React + TypeScript widgets for Framer. Use via CDN (Free) or npm (Paid).

## Dev

```bash
npm install
npm run build
```

## Framer Free (Embed)

Load from GitHub Pages after CI deploy:

```html
<script src="https://<user>.github.io/<repo>/index.umd.js"></script>
<script>
  window.DMWidgets.init({ apiBaseUrl: "https://api.example.com" });
</script>
<div id="dm-list"></div>
<script>
  const el = document.getElementById("dm-list");
  const { mountReact, SimpleList } = window.DMWidgets;
  mountReact(el, React.createElement(SimpleList, { endpoint: "/items" }));
</script>
```

## Framer Paid (Code Components)

```bash
npm install deemoney-framer-widgets react react-dom react-hook-form
```

```tsx
import { init, SimpleList } from "deemoney-framer-widgets";
init({ apiBaseUrl: "https://api.example.com" });
export function Items() {
  return <SimpleList endpoint="/items" />;
}
```

MIT
