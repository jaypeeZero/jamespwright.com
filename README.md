# jamespwright.com

Personal site of James P. Wright — built with [Eleventy](https://www.11ty.dev/),
deployed to DreamHost by GitHub Actions on every push to `main`.

```
src/
  _data/site.json        site title, tagline, links
  _includes/base.njk     page shell (header, nav, footer)
  _includes/programming.njk  base + the programming section sidebar
  assets/style.css
  .htaccess              copied to the web root on build
  index.njk  projects.njk  404.njk
  programming/           the engineering ideals, one page per topic
```

## Commands

| | |
|---|---|
| `npm run serve` | local preview at http://localhost:8080 |
| `npm run build` | build to `_site/` |

## Adding a programming page

Drop a markdown file in `src/programming/` with front matter:

```yaml
---
title: Observability
order: 8
---
```

`order` places it in the section sidebar. The layout is applied automatically by
`src/programming/programming.11tydata.json`.

## Deploying

See [DEPLOY.md](DEPLOY.md).
