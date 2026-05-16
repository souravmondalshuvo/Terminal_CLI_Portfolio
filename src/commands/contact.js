import { esc } from '../utils/dom.js';

export function register(registry) {
  registry.register({
    name: 'contact',
    description: 'how to reach me',
    handler: (_args, { renderer, profile }) => {
      const { contact } = profile;
      renderer.heading('Get in touch');
      renderer.block([
        ['email',  renderer.link(`mailto:${contact.email}`, contact.email, false)],
        ['github', renderer.link(contact.github)],
        ['where',  esc(contact.location)],
      ]);
    },
  });

  registry.register({
    name: 'github',
    description: 'open my GitHub',
    handler: (_args, { renderer, profile }) => {
      renderer.write(renderer.link(profile.contact.github));
    },
  });

  // `social` is just contact under a more conventional name
  registry.alias('social', 'contact');
}
