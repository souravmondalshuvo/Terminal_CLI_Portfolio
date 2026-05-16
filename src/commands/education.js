import { esc } from '../utils/dom.js';

export function register(registry) {
  registry.register({
    name: 'education',
    description: 'where I study',
    handler: (_args, { renderer, profile }) => {
      renderer.heading('Education');
      renderer.blank();
      profile.education.forEach((e) => {
        renderer.muted(e.period);
        renderer.write(`  <span class="accent">${esc(e.degree)}</span>`);
        renderer.muted(`  ${e.org}`);
      });
    },
  });
}
