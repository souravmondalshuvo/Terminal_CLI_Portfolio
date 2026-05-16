import { esc } from '../utils/dom.js';

/**
 * `about` and `whoami` — biographical content from profile.
 * Grouped here because they read the same source and would otherwise
 * fragment trivial content across two files.
 */
export function register(registry) {
  registry.register({
    name: 'about',
    description: 'who I am',
    handler: (_args, { renderer, profile }) => {
      renderer.write(
        `<span class="h">${esc(profile.name)}</span>` +
        `<span class="muted"> — ${esc(profile.role)}</span>`
      );
      renderer.muted(profile.location);
      renderer.blank();
      profile.bio.forEach((line) => {
        renderer.write(line ? esc(line) : '&nbsp;');
      });
    },
  });

  registry.register({
    name: 'whoami',
    description: 'quick stats',
    handler: (_args, { renderer, profile }) => {
      renderer.write(`<span class="accent">${esc(profile.name)}</span>`);
      renderer.block([
        ['role',     esc(profile.role)],
        ['focus',    esc(profile.tagline)],
        ['location', esc(profile.location)],
      ]);
    },
  });
}
