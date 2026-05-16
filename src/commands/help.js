import { el, esc } from '../utils/dom.js';

/**
 * `help` — auto-generated command list.
 *
 * Reads directly from the registry, so any command registered after
 * help (or in any order) appears here without manual edits.
 */
export function register(registry) {
  registry.register({
    name: 'help',
    description: 'list available commands',
    handler: (_args, { renderer, terminal }) => {
      renderer.heading('Available commands');
      const wrap = el('div', 'block');
      terminal.registry.list().forEach((c) => {
        const row = el('div', 'row');
        const name = c.usage ? `${c.name} ${c.usage}` : c.name;
        row.innerHTML =
          `<span class="row__label key">${esc(name)}</span>` +
          `<span class="row__value muted">${esc(c.description)}</span>`;
        wrap.appendChild(row);
      });
      renderer.root.appendChild(wrap);
      renderer.write(
        `<span class="muted">Tip: </span>` +
        `<span class="key">Tab</span><span class="muted"> autocompletes · </span>` +
        `<span class="key">↑/↓</span><span class="muted"> walks history · </span>` +
        `<span class="key">^L</span><span class="muted"> clears.</span>`
      );
    },
  });
}
