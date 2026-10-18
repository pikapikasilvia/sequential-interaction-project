# sequential-interaction-project
coding class works

## Pompom Sequence prototype

`docs/` holds a static, no-build website combining the three pompom studies
(`artifacts/pompom-hold-study`, `artifacts/pompom-drag-study`, `artifacts/pompom-throw-study`) into one
linear sequence: **Hold → Drag → Throw**, with the same pompom throughout.

- **Hold** – press and hold ~1.1 s until the ring fills and the pompom puffs up; releasing early drains it.
- **Drag** – drag the pompom into the dashed launch mark and release; it snaps onto the mark. Released elsewhere, it stays where it is.
- **Throw** – pull back from the mark and release (Throw study slingshot, arc and bounce). Landing in the ring ends the sequence; a miss rolls back to the launch mark to try again.
- **Reset** (bottom) returns to the start of Hold at any time.

- **Controls** – a collapsible panel on the left tunes Hold, Drag and Throw live. *Restore defaults* returns to the saved values (`SAVED` in `docs/pompom.js`); *Copy settings* copies all current values.

Files: `docs/index.html`, `docs/style.css`, `docs/pompom.js` (engine, sequence and saved defaults), `docs/panel.js` (control panel),
`docs/fibers.js` (fiber data from the studies), `docs/.nojekyll`. The original studies are in `artifacts/`.
To publish, set GitHub Pages to deploy from the `main` branch, `/docs` folder.
