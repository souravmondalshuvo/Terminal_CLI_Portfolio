import { esc } from '../utils/dom.js';

export function register(registry) {
  registry.register({
    name: 'skills',
    description: 'tools I work with',
    handler: (_args, { renderer, profile }) => {
      renderer.heading('Skills & tooling');
      const rows = Object.entries(profile.skills).map(([category, items]) => [
        esc(category),
        renderer.pills(items),
      ]);
      renderer.block(rows);
    },
  });
}
