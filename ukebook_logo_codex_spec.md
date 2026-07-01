# UkeBook x Eddie Logo Spec

## Goal

Create an editable UkeBook x Eddie logo that keeps the current fresh ukulele teaching-site tone, but moves much closer to the supplied reference badge: a premium tropical level-pass, not a small flat sticker.

## Visual Direction

- Rounded travel-badge silhouette with a deep teal shell, cream outer rim, and layered shadow.
- Top clip/lanyard hardware with an Eddie "E" monogram.
- Tropical sunrise scene inside the badge: sun, rays, clouds, ocean waves, palms, hibiscus flowers, and a small music note.
- Large diagonal ukulele as the primary object, with cream outline, green headstock, visible strings, frets, bridge, and sound hole.
- Text hierarchy:
  - `EDDIE` arched near the top.
  - `UkeBook` large cream serif wordmark across the bottom.
  - `LEVEL ATLAS` small uppercase label below.

## Deliverables

- `ukebook_logo.svg`: editable standalone SVG.
- `UkebookLogo.tsx`: inline React SVG component with the same visual structure.
- Homepage integration: the lanyard/logo area should use the SVG asset so the visible result matches the new source file.

## Editing Notes

- Main editable groups are named with `id`: `clip`, `badge-shell`, `tropical-scene`, `ukulele-hero`, `wordmark`, and `bottom-label`.
- Text remains live SVG text for easier copy/font changes.
- Color stops and strokes are defined in SVG defs rather than flattened bitmap pixels.
