import { esc } from '../utils/dom.js';

/**
 * Virtual file system. Each "file" maps to a command name so
 * `cat about.md` and `about` produce the same output. The mapping
 * is declared once and used by both `ls` and `cat`.
 */
const FILES = Object.freeze({
  'about.md':     'about',
  'projects.md':  'projects',
  'skills.md':    'skills',
  'education.md': 'education',
  'contact.md':   'contact',
});

export function register(registry) {
  registry.register({
    name: 'ls',
    description: 'list this directory',
    handler: (_args, { renderer, profile }) => {
      const fileItems = Object.keys(FILES).map(
        (f) => `<span class="key">${esc(f)}</span>`
      );
      const dirItems = [
        renderer.link(profile.contact.github, 'github/'),
        `<span class="muted">.secrets/</span>`,
      ];
      renderer.write([...fileItems, ...dirItems].join('   '));
    },
  });

  registry.register({
    name: 'cat',
    description: 'print a file (try: cat about.md)',
    usage: '<file>',
    handler: (args, ctx) => {
      const file = (args[0] ?? '').toLowerCase();
      if (!file) return ctx.renderer.error('cat: missing file operand');
      if (file.startsWith('.secrets')) {
        return ctx.renderer.error(`cat: ${file}: Permission denied`);
      }
      const target = FILES[file];
      if (!target) {
        return ctx.renderer.error(`cat: ${file}: No such file or directory`);
      }
      const cmd = ctx.terminal.registry.get(target);
      cmd?.handler([], ctx);
    },
  });
}
