# Angular 22 upgrade — user guide

**For whom:** anyone who builds or runs the Directory frontend on their machine.

## What changed for you

The frontend now runs on **Angular 22** (the same version family as `zerobound-frontend`), **NgRx 22** and **TypeScript 6**. The screens and the behaviour of the site are the same: this is a tooling upgrade, with no new feature.

## What you need on your machine

| Tool | Before | Now |
|------|--------|-----|
| Node.js | 22.14 | **24** (or 22.22.3 or newer; older 22.x no longer works) |
| pnpm | any | **12** (`corepack enable`) |

## Daily commands (unchanged)

```bash
pnpm install        # first time and after pulling
pnpm test           # Karma + Jasmine, headless Chrome
pnpm run dev:unix   # build in watch mode + BFF
```

## If `pnpm install` stops with `ERR_PNPM_IGNORED_BUILDS`

pnpm 12 blocks install scripts that are not allowed. The allowed ones are listed in `pnpm-workspace.yaml` (`allowBuilds`); make sure that file is present and up to date with `git pull`.

## Tailwind CSS

Tailwind was **not** changed (still v4, `^4.2.0` range). `zerobound-frontend` does not use Tailwind, so there is no version there to copy.
