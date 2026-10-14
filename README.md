# sequential-interaction-project
coding class works

## Pompom Sequence prototype

`docs/` holds a static, no-build website combining the three pompom studies
(`pompom-hold-study.zip`, `pompom-drag-study.zip`, `pompom-flick-study.zip`) into one
linear sequence: **Hold → Drag → Flick**, with the same pompom throughout.

- **Hold** – press and hold ~1.1 s until the ring fills; releasing early drains it.
- **Drag** – drag the pompom at least 1.5 widths and release.
- **Flick** – throw it faster than 900 px/s; a slower release just settles and you can try again.
- **End** – it bounces off the walls and settles where it lands. Reset (bottom) restarts at any time.

Files: `docs/index.html`, `docs/style.css`, `docs/pompom.js` (engine and sequence),
`docs/fibers.js` (fiber data from the studies), `docs/.nojekyll`.
To publish, set GitHub Pages to deploy from the `main` branch, `/docs` folder.
