# Ukulele Teaching Assistant

A static UkuleleBook teaching-site framework with a fresh dopamine palette, animated lesson sections, and a ukulele-only Web Audio tuner.

## Features

- Ukulele-focused homepage, level path, song catalog, and lesson cards
- Ukulele-only tuner using standard `G4 C4 E4 A4` tuning
- Browser microphone input through the Web Audio API
- Local pitch detection and cents offset meter
- No bundled real audio, score, support, or payment resources

## Local Use

```powershell
npm test
npm run check
python -m http.server 4184 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4184/`.

Microphone access requires a browser permission prompt. The tuner runs locally in the browser and does not upload audio.
