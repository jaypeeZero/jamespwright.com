# Deploying jamespwright.com (DreamHost)

Every push to `main` runs `.github/workflows/deploy.yml`: it builds the site
(`npm ci && npm run build`) and `rsync`s `_site/` to DreamHost over SSH.

Deploy user: `ssh_admin_jamespwright_com`, docroot `~/jamespwright.com/`.

## ⚠️ The web root is not exclusively ours — mind the protect filters

The docroot used to hold ~28GB of unrelated personal files going back to 2009.
Those were moved to `~/archive/` (outside the web root) on 2026-08-05; only
`ebooks/` was left in place, because it is meant to stay public. Restore any of
it with `mv ~/archive/<name> ~/jamespwright.com/`.

`rsync --delete` is therefore safe *only* because of the `--filter='protect ...'`
lines in the workflow. **Before dropping any unlinked route into the web root by
hand, add a protect line for it** — otherwise the next deploy erases it.

Currently protected: `ebooks/`, `.dh-diag` (a root-owned DreamHost symlink).

## Unlinked routes

`src/.htaccess` sets `Options -Indexes`, so a directory in the web root with no
`index.html` returns 403 rather than a browsable listing. Content dropped there is
reachable by direct URL but is not advertised, and nothing links to it from the
site nav. A directory that *should* be browsable opts back in with its own
`.htaccess` containing `Options +Indexes` — `ebooks/` does exactly this.

## One-time setup

1. **Install the deploy key.** A keypair lives at `~/.ssh/jamespwright_deploy`
   on the dev machine. Append the public half to the server:
   ```
   ssh-copy-id -i ~/.ssh/jamespwright_deploy.pub ssh_admin_jamespwright_com@jamespwright.com
   ```
   Verify: `ssh -i ~/.ssh/jamespwright_deploy ssh_admin_jamespwright_com@jamespwright.com pwd`
2. **Actions secrets** (repo → Settings → Secrets and variables → Actions):
   ```
   gh secret set DEPLOY_SSH_KEY  -R jaypeeZero/jamespwright.com < ~/.ssh/jamespwright_deploy
   gh secret set DEPLOY_SSH_USER -R jaypeeZero/jamespwright.com -b "ssh_admin_jamespwright_com"
   ```
3. **HTTPS — already done, nothing to do.** A Let's Encrypt certificate covering
   both `jamespwright.com` and `www.jamespwright.com` is installed, HTTPS is forced,
   and the apex 301s to `www` — all at the DreamHost server level. `www` is
   canonical. Do **not** add a www→apex rule to `src/.htaccess`; it would loop
   against DreamHost's apex→www redirect.

## Retiring programming.jamespwright.com

The programming content now builds to `/programming/` on the main site. The old
subdomain is deployed by a *different* repo — `jamesw-mf/holding-space`, workflow
`.github/workflows/deploy.yml`, rsyncing `my-ideals/_site/` as `mf_gh_user`. Until
that workflow is disabled it will keep overwriting the subdomain.

1. Disable or delete that workflow in `holding-space`.
2. Put a redirect in the subdomain docroot so old links survive:
   ```
   # ~/programming.jamespwright.com/.htaccess
   RewriteEngine On
   RewriteRule ^(.*)$ https://jamespwright.com/programming/$1 [R=301,L]
   ```
   Note the subdomain resolves to a different DreamHost IP than the apex, so this
   file has to be placed on that host — it is not part of this repo's rsync target.

## Manual deploy
Actions tab → Deploy jamespwright.com → Run workflow (`workflow_dispatch`).

## Local preview
`npm install` then `npm run serve` → http://localhost:8080

## Notes
- Clean URLs need no config: Eleventy emits `/about/index.html`,
  `/programming/<slug>/index.html`, etc.
- Programming pages order themselves in the section nav by the `order:` value in
  each file's front matter (`eleventy.config.js`, `programming` collection).
- `src/.htaccess` is passed through to `_site/.htaccess` on every build.
