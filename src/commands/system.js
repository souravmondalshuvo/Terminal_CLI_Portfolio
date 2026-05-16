import { esc } from '../utils/dom.js';
import { THEMES } from '../config/themes.js';
import { BANNER } from '../utils/ascii.js';

/**
 * System / terminal-mechanics commands.
 *
 * These commands operate on the terminal itself rather than on
 * profile content. Grouping them keeps the per-command files small
 * without losing clarity — each registration is a few lines.
 */
export function register(registry) {
  registry.register({
    name: 'clear',
    description: 'clear the screen',
    handler: (_args, { terminal }) => terminal.clear(),
  });
  registry.alias('cls', 'clear');

  registry.register({
    name: 'theme',
    description: `cycle themes — try: theme ${THEMES.join('|')}`,
    usage: '[name]',
    handler: (args, { renderer, terminal }) => {
      let next;
      if (args[0]) {
        if (!THEMES.includes(args[0])) {
          return renderer.error(
            `theme: unknown theme '${args[0]}'. try: ${THEMES.join(', ')}`
          );
        }
        next = args[0];
      } else {
        const current = terminal.getTheme();
        next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
      }
      terminal.setTheme(next);
      renderer.write(`<span class="ok">theme set: ${esc(next)}</span>`);
    },
  });

  registry.register({
    name: 'banner',
    description: 'show the banner',
    handler: (_args, { renderer }) => renderer.write(BANNER, 'banner'),
  });

  registry.register({
    name: 'date',
    description: 'current date/time',
    handler: (_args, { renderer }) => renderer.text(new Date().toString()),
  });

  registry.register({
    name: 'history',
    description: 'command history',
    handler: (_args, { renderer, terminal }) => {
      const all = terminal.history.all();
      if (all.length === 0) return renderer.muted('no history yet');
      all.forEach((h, i) => {
        renderer.write(
          `<span class="muted">${String(i + 1).padStart(3, ' ')}</span>  ${esc(h)}`
        );
      });
    },
  });

  registry.register({
    name: 'echo',
    description: 'print arguments',
    usage: '<text>',
    handler: (args, { renderer }) => renderer.text(args.join(' ')),
  });
}
