import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8');
function browser(choice = null, hostname = 'thepharmacoach.com') {
  const nodes = new Map();
  const handlers = {};
  const scripts = [];
  const location = { hostname, href: `https://${hostname}/about/?email=private@example.com&utm_source=newsletter#profile`, origin: `https://${hostname}`, reload() { this.reloaded = true; } };
  const document = {
    title: 'About The Pharma Coach', referrer: 'https://example.com/?email=private@example.com', readyState: 'complete', cookie: '',
    createElement(tag) { return { tag, addEventListener(name, callback) { this[name] = callback; }, setAttribute(name, value) { this[name] = value; }, removeAttribute(name) { delete this[name]; } }; },
    head: { append(node) { scripts.push(node); } },
    body: { append(...items) { for (const node of items) nodes.set(node.id, node); } },
    getElementById(id) { return nodes.get(id); },
    addEventListener(name, callback) { handlers[name] = callback; },
  };
  const window = { addEventListener(name, callback) { handlers[name] = callback; } };
  const context = vm.createContext({ window, document, location, URL, Date, localStorage: { getItem: () => choice, setItem() {} } });
  vm.runInContext(source, context);
  const commands = () => window.dataLayer.map(args => [...args]);
  return { window, document, location, scripts, nodes, commands, context, handlers,
    choose(value) { nodes.get('analytics-choice').click({ target: { closest: () => ({ dataset: { choice: value } }) } }); },
  };
}

test('no Google script or page view before consent or after decline', () => {
  const b = browser();
  assert.equal(b.scripts.length, 0);
  b.choose('denied');
  assert.equal(b.scripts.length, 0);
  assert.equal(b.commands().filter(c => c[0] === 'event').length, 0);
});
test('consent loads the historical property once with one sanitized page view', () => {
  const b = browser();
  b.choose('granted'); b.choose('granted'); b.window.pharmaAnalytics.pageView();
  vm.runInContext(source, b.context);
  assert.equal(b.scripts.length, 1);
  assert.match(b.scripts[0].src, /G-CE0YM7TDCH$/);
  assert.equal(b.commands().filter(c => c[0] === 'config').length, 1);
  const views = b.commands().filter(c => c[1] === 'page_view');
  assert.equal(views.length, 1);
  assert.equal(views[0][2].page_location, 'https://thepharmacoach.com/about/?utm_source=newsletter');
  assert.equal(views[0][2].page_referrer, 'https://example.com/');
});
test('previews never send production analytics even with saved consent', () => {
  for (const host of ['localhost', 'preview.pages.dev', 'shaneemoret.github.io']) assert.equal(browser('granted', host).scripts.length, 0);
});
test('withdrawal stops events and reloads the loaded tag', () => {
  const b = browser('granted');
  b.choose('denied');
  assert.equal(b.window['ga-disable-G-CE0YM7TDCH'], true);
  assert.equal(b.location.reloaded, true);
  const before = b.commands().length;
  b.window.pharmaAnalytics.event('schedule_call_click', {});
  assert.equal(b.commands().length, before);
});
test('booking clicks measure intent without claiming completed leads or revenue', () => {
  const b = browser('granted');
  const link = { href: 'https://medrepcollege.com/secure-your-spot?email=private@example.com', closest: () => null };
  b.handlers.click({ target: { closest: () => link } });
  const events = b.commands().filter(c => c[0] === 'event');
  assert.equal(events.at(-1)[1], 'schedule_call_click');
  assert.equal(events.at(-1)[2].link_url, 'https://medrepcollege.com/secure-your-spot');
  assert.ok(!events.some(c => ['generate_lead', 'purchase'].includes(c[1])));
});
