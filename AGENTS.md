# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single **Ghost theme** named `wordman` (forked from TryGhost/Casper).
It is not a monorepo and has no backend of its own — it is a set of Handlebars
templates plus a Gulp/PostCSS asset pipeline that runs inside Ghost CMS.

### Standard commands (see `package.json`)

- `yarn dev` — gulp: builds `assets/built/` then watches `assets/css`, `assets/js`,
  and `*.hbs`, with a LiveReload server on port `35729`.
  Note: this is a build/watch process only — it does **not** serve the site over HTTP.
  Open the site through a running Ghost instance (see below).
- `yarn build` — one-off asset compile into `assets/built/`.
- `yarn test` — runs `gulp build` (via `pretest`) then `gscan .` (theme compatibility
  validation). This is the only "test" — there is no unit/integration suite.
- `yarn test:ci` — `gscan --fatal --verbose .` (fatal issues only).
- `yarn zip` — packages the theme into `dist/wordman.zip`.
- There is **no lint** configured (no ESLint/Prettier/`lint` script).

### Running the theme end-to-end (local Ghost)

The theme can only be rendered by Ghost. A local Ghost install is preinstalled in the
environment snapshot at `/home/ubuntu/ghost-site` (SQLite, development mode).

- Ghost 6.x requires Node `^22.23.1`. The default `node` on `PATH` (`/exec-daemon/node`)
  is v22.14.0 and is **too old** for Ghost and for the Ghost CLI. Use nvm's Node 22.23.1
  and make sure it wins over the `/exec-daemon/node` shim, e.g.:
  `export NVM_DIR="/home/ubuntu/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.1; export PATH="$NVM_DIR/versions/node/v22.23.1/bin:$PATH"`
  (The repo's own `yarn install`/`yarn dev`/`yarn build`/`yarn test` work fine on the
  default Node — the newer Node is only needed to run Ghost itself.)
- Manage Ghost from `/home/ubuntu/ghost-site`: `ghost start`, `ghost restart`, `ghost stop`.
  Site: http://localhost:2368/  •  Admin: http://localhost:2368/ghost/
- The theme is symlinked into Ghost at `content/themes/wordman -> /workspace`.
  Ghost only scans themes at boot, so after first linking a theme (or renaming files)
  run `ghost restart`, then activate it (Ghost Admin → Settings → Design, or the Admin API).
- `.hbs` template edits are picked up on the next request, but **CSS/JS changes require a
  rebuild** (`yarn build` or a running `yarn dev`) because Ghost serves the compiled files
  from `assets/built/`.
- Local dev owner account (throwaway, local only): `admin@example.com` / `HelloWorld12345`.
- A homepage button like "Read blog" 404s until pages with the matching slugs
  (`blog`, `talks`, `podcast`, etc.) are created in Ghost — that is content setup, not a
  theme bug. Custom routing lives in `routes.yaml` (upload via Ghost Admin → Settings → Labs).
