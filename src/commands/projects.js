import { esc } from '../utils/dom.js';

export function register(registry) {
  registry.register({
    name: 'projects',
    description: 'things I have shipped',
    handler: (_args, { renderer, profile }) => {
      renderer.heading('Selected projects');
      renderer.blank();
      profile.projects.forEach((p, i) => {
        renderer.write(
          `<span class="accent">› ${esc(p.name)}</span>` +
          `<span class="muted"> — ${esc(p.year)}</span>`
        );
        renderer.write(
          `  <span class="muted">stack:</span> ` +
          `<span class="key">${esc(p.stack)}</span>`
        );
        renderer.write(`  ${esc(p.desc)}`);
        if (p.link) {
          renderer.write(`  <span class="muted">live: </span>${renderer.link(p.link)}`);
        }
        if (p.repo) {
          renderer.write(`  <span class="muted">repo: </span>${renderer.link(p.repo)}`);
        }
        if (i < profile.projects.length - 1) renderer.blank();
      });
    },
  });
}
