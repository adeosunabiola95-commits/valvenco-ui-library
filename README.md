# Valvenco UI Library

Storybook for the Valvenco UI: typography, color, button, iconography, motion, and scroll.

## Requirements

- [Node.js](https://nodejs.org/) 20.19 or newer, or 22.12 or newer
- npm (comes with Node.js)
- Git

Storybook loads Inter from Google Fonts, so the machine needs network access while Storybook is running.

## Setup

```bash
git clone https://github.com/adeosunabiola95-commits/valvenco-ui-library.git
cd valvenco-ui-library
npm ci
```

`npm ci` installs the versions in `package-lock.json`. There is no `.env` file to create.

## Run Storybook

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006). The server keeps running until you stop it with Ctrl+C. Saving a story or style reloads the page.

## Build

```bash
npm run build-storybook
```

This writes a static site to `storybook-static/`. That folder is not committed. To check the build locally:

```bash
npx serve storybook-static
```

## Where to work

| Path | What it is |
| --- | --- |
| `stories/` | Storybook stories. A file named `*.stories.js` is picked up automatically. |
| `css/motion.css` | Foundation and component styles used by the stories. |
| `js/` | Button, icon, scroll, and system behavior. |
| `.storybook/` | Storybook configuration and preview styles. |
| `index.html` | Standalone motion lab. Serve the repo root with a local server; opening the file directly will not load its modules. |

Story order in the sidebar is Typography, Button, Color, Iconography, Motion, Scroll.
