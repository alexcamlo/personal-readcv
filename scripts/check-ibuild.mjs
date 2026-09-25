// Run against the dev server: node scripts/check-ibuild.mjs http://localhost:3001
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const session = `ibuild-check-${process.pid}`;
const browser = (...args) => execFileSync('agent-browser', ['--session', session, ...args], {
  encoding: 'utf8', timeout: 30000,
});
const evaluate = (code) => JSON.parse(browser('eval', code));

try {
  browser('open', new URL('/ibuild', process.argv[2] ?? 'http://localhost:3001').href);
  evaluate('top.document.documentElement.style.scrollBehavior = "auto"');
  assert.equal(evaluate('top.document.querySelectorAll("h1").length'), 1);
  assert.equal(evaluate('top.document.querySelectorAll("img:not([alt])").length'), 0);
  assert.equal(evaluate('top.document.querySelector("video").autoplay'), false);
  assert.equal(evaluate(`top.document.querySelector('nav a[href="https://alejandrocamara.info"]') !== null`), true);

  for (const width of [1440, 390, 320]) {
    browser('set', 'viewport', String(width), '844');
    browser('open', new URL('/ibuild', process.argv[2] ?? 'http://localhost:3001').href);
    evaluate('top.document.documentElement.style.scrollBehavior = "auto"');
    assert.equal(evaluate('top.document.documentElement.scrollWidth <= top.innerWidth'), true);
    assert.equal(evaluate(`(() => {
      top.scrollTo({ top: 1400, behavior: 'instant' });
      return Math.round(top.document.querySelector('nav[aria-label="Projects"]').getBoundingClientRect().top);
    })()`), 0, `navigation sticks at ${width}px`);
    browser('scrollintoview', '#keyboard button[aria-haspopup="dialog"]');
    browser('focus', '#keyboard button[aria-haspopup="dialog"]');
    browser('press', 'Space');
    browser('wait', '--fn', 'top.document.querySelector("dialog[open] img")?.complete');
    assert.equal(evaluate(`(() => {
      const dialog = top.document.querySelector('dialog[open]');
      const box = dialog.getBoundingClientRect();
      return box.left >= 0 && box.right <= top.innerWidth && box.top >= 0 && box.bottom <= top.innerHeight
        && dialog.contains(top.document.activeElement) && dialog.querySelector('img').naturalWidth > 0;
    })()`), true, `lightbox fits and receives focus at ${width}px`);
    browser('press', 'Escape');
    assert.equal(evaluate('top.document.querySelector("dialog[open]") === null'), true);
    browser('wait', '--fn', 'top.document.activeElement.matches("button[aria-haspopup=dialog]")');
    browser('scrollintoview', 'iframe');
    browser('wait', '--fn', 'top.document.querySelector("iframe").contentDocument?.querySelector("#start")?.disabled === false');
    const layout = evaluate(`(() => {
      const iframe = top.document.querySelector('iframe');
      const doc = iframe.contentDocument;
      const frame = doc.querySelector('#window-frame').getBoundingClientRect();
      const buttons = [...doc.querySelectorAll('nav button')].filter(b => !b.hidden);
      return {
        fits: frame.left >= 0 && frame.right <= iframe.clientWidth && frame.bottom <= iframe.clientHeight,
        controlsFit: buttons.every(b => {
          const box = b.getBoundingClientRect();
          return box.left >= 0 && box.right <= iframe.clientWidth && box.bottom <= iframe.clientHeight;
        }),
        introHidden: doc.querySelector('#level-intro').hidden,
      };
    })()`);
    assert.deepEqual(layout, { fits: true, controlsFit: true, introHidden: true });
  }

  browser('scrollintoview', '#keyboard summary');
  browser('focus', '#keyboard summary');
  browser('press', 'Space');
  browser('wait', '--fn', 'top.document.querySelector("#keyboard details").open && !top.document.querySelector("#keyboard [role=group] button").disabled');
  browser('scrollintoview', '#keyboard button[aria-pressed]');
  browser('focus', '#keyboard button[aria-pressed]');
  browser('press', 'Space');
  assert.equal(evaluate('top.document.querySelector("#keyboard button[aria-pressed]").getAttribute("aria-pressed")'), 'true');
  browser('focus', '#keyboard [role=group] button:nth-child(2)');
  browser('press', 'Space');

  browser('scrollintoview', 'iframe');
  assert.equal(evaluate(`(() => {
    const doc = top.document.querySelector('iframe').contentDocument;
    const sound = doc.querySelector('#sound');
    const before = sound.getAttribute('aria-pressed');
    sound.click();
    return sound.getAttribute('aria-pressed') !== before;
  })()`), true);
  evaluate('top.document.querySelector("iframe").contentDocument.querySelector("#start").click(); true');
  browser('wait', '--fn', '!top.document.querySelector("iframe").contentDocument.querySelector("#pause").hidden');
  evaluate('top.document.querySelector("iframe").contentDocument.querySelector("#pause").click(); true');
  assert.equal(evaluate('top.document.querySelector("iframe").contentDocument.querySelector("#pause").textContent'), 'Resume');
  console.log('PASS: sticky nav, responsive lightboxes and focus return, keyboard model controls, game start/pause and sound');
} finally {
  browser('close');
}
