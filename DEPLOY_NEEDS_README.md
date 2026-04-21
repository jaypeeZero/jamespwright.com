# Deploy Setup — programming.jamespwright.com

What's needed to get the GitHub Actions deploy for `programming/` working.

## 1. Configure two Actions secrets

In this repo: Settings → Secrets and variables → Actions → New repository secret.

- **`DEPLOY_SSH_KEY`** — private SSH key (PEM) authorized on the DreamHost box for whichever user you pick. The old `mf_gh_user` key on the MF repo is unreadable (GitHub secrets are write-only), so either:
  - Find the original private key locally (likely one of `~/.ssh/id_*` files — whichever pubkey is in `~mf_gh_user/.ssh/authorized_keys` on DreamHost), **or**
  - Generate a fresh keypair:
    ```
    ssh-keygen -t ed25519 -f ~/.ssh/programming_deploy -C "programming-deploy"
    ```
    Add the `.pub` to `~/.ssh/authorized_keys` on DreamHost under the deploy user, then paste the private key into the secret.

- **`DEPLOY_SSH_USER`** — SSH username to log in as on `jamespwright.com`. Reuse `mf_gh_user` if that account still exists on DreamHost and you have its key, or create a new deploy user.

CLI alternative (once `gh` is authed as the repo owner):
```
gh secret set DEPLOY_SSH_KEY -R jaypeeZero/jamespwright.com < /path/to/private_key
gh secret set DEPLOY_SSH_USER -R jaypeeZero/jamespwright.com -b "mf_gh_user"
```

## 2. Merge the PR

The deploy workflow only runs on pushes to `master`.

## 3. Verify DreamHost docroot

The rsync target `~/programming.jamespwright.com/` is relative to the SSH user's home. If you switch users, confirm that path exists and is the docroot for the `programming.jamespwright.com` subdomain in DreamHost's panel.

## 4. Auth `gh` for the repo owner account (optional)

```
gh auth login   # pick GitHub.com, SSH, add account
```

Lets you manage secrets and PRs for this repo from the CLI.

## 5. Merge the holding-space cleanup PR

See `jamesw-mf/holding-space` PR #6. Merge it **after** confirming the new deploy runs green — not before, so there's a working fallback.

## 6. Delete this file

Once deploys are working, this README has served its purpose.
