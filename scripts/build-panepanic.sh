#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
work=.panepanic-build
if [ -e "$work" ]; then echo "$work already exists; refusing to overwrite" >&2; exit 1; fi
trap 'trash "$work"' EXIT
git clone --quiet https://github.com/alexcamlo/panepanic.git "$work"
git -C "$work" checkout --quiet 9d2c728a9b3ff14758115f827e1176f8561e4cc9
python3 - "$work" <<'PY'
from pathlib import Path
import sys
root = Path(sys.argv[1])
campaign = root / 'src/campaign.ts'
s = campaign.read_text()
start = s.index('export const CAMPAIGN_LEVELS:')
end = s.index('export const CAMPAIGN_LEVEL_COUNT', start)
s = s[:start] + """export const CAMPAIGN_LEVELS: readonly CampaignLevel[] = deepFreeze([{
  number: 1,
  id: MOUNTAIN_PASS.id,
  name: MOUNTAIN_PASS.name,
  description: MOUNTAIN_PASS.description,
  landscape: { asset: 'landscape-background.png', alt: 'A winter mountain at twilight.' },
  level: MOUNTAIN_PASS,
}]);

""" + s[end:]
campaign.write_text(s)
main = root / 'src/main.ts'
s = main.read_text().replace('CAMPAIGN_LEVEL_COUNT, DAWN_MEADOW', 'CAMPAIGN_LEVEL_COUNT, MOUNTAIN_PASS').replace('Math.random, DAWN_MEADOW', 'Math.random, MOUNTAIN_PASS')
s = s.replace("const CAMPAIGN_KEY = 'panepanic:campaign:v1';", "const CAMPAIGN_KEY = 'panepanic:ibuild:v1';")
start = s.index('const LANDSCAPE_ASSETS:')
end = s.index('type LandscapeStatus', start)
s = s[:start] + """const LANDSCAPE_ASSETS: Record<string, string> = {
  'landscape-background.png': new URL('../assets/landscape-background.png', import.meta.url).href,
};
""" + s[end:]
s = s.replace('`Level ${entry.number} — ${entry.name}`', '`Level 3 — ${entry.name}`').replace('`Level ${selectedEntry.number} — ${selectedEntry.name}`', '`Level 3 — ${selectedEntry.name}`')
s = s.replace('render();\nnew ResizeObserver(fitWindow)', 'enterLevel(CAMPAIGN_LEVELS[0]!);\nrender();\nnew ResizeObserver(fitWindow)')
s = s.replace('levelSelectButton.hidden = false;', 'levelSelectButton.hidden = true;')
s = s.replace('(nextLevelButton.hidden ? levelSelectButton : nextLevelButton).focus({ preventScroll: true });', 'againButton.focus({ preventScroll: true });')
s = s.replace('levelIntro.hidden = false;', 'levelIntro.hidden = true;')
s = s.replace("levelIntro.hidden = state.phase !== 'idle';", 'levelIntro.hidden = true;')
s = s.replace("soundButton.setAttribute('aria-pressed', String(!muted));", "soundButton.setAttribute('aria-pressed', String(!muted));\nsoundButton.textContent = muted ? 'Sound off' : 'Sound on';")
main.write_text(s)
html = root / 'index.html'
s = html.read_text()
s = s.replace('            <button id="retry" hidden type="button">Retry Landscape</button>\n            <button id="start" disabled type="button">Start Level</button>\n', '')
s = s.replace('    <nav aria-label="Game controls">', '    <nav aria-label="Game controls">\n      <button id="retry" hidden type="button">Retry Landscape</button>\n      <button id="start" disabled type="button">Start Level</button>')
s = s.replace('hidden role="dialog" aria-modal="true" aria-labelledby="level-title" aria-describedby="level-description"', 'hidden aria-labelledby="level-title"')
s = s.replace('      <button id="sound" aria-pressed="true" type="button">Sound</button>\n', '')
s = s.replace('    <nav aria-label="Game controls">', '    <nav aria-label="Game controls">\n      <button id="sound" aria-pressed="true" type="button">Sound on</button>')
html.write_text(s)
css = root / 'src/style.css'
css.write_text(css.read_text() + "\n/* The portfolio embed keeps only the playfield and essential run controls. */\nheader, #level-intro { display: none !important; }\nmain { grid-template-rows: minmax(0, 1fr) auto; }\n#window-space { grid-row: 1; }\nnav { grid-row: 2; }\n")
PY
(cd "$work" && npm ci --silent && npm run typecheck && npm run test:model && npm run build -- --base=/panepanic/)
if [ -e public/panepanic ]; then trash public/panepanic; fi
mkdir -p public/panepanic
cp -R "$work/dist/." public/panepanic/
