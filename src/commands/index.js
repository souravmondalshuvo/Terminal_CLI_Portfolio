/**
 * Central command registration.
 *
 * Each command file exports a `register(registry)` function. This
 * module wires them all up in a single pass. The order here is the
 * order they appear in `help`, so it doubles as a table of contents.
 *
 * Adding a new command:
 *   1. Create src/commands/<name>.js with `export function register(...) { ... }`
 *   2. Import + call it below.
 */
import { register as registerHelp }      from './help.js';
import { register as registerAbout }     from './about.js';
import { register as registerProjects }  from './projects.js';
import { register as registerSkills }    from './skills.js';
import { register as registerEducation } from './education.js';
import { register as registerContact }   from './contact.js';
import { register as registerFs }        from './fs.js';
import { register as registerSystem }    from './system.js';

export function registerAll(registry) {
  registerHelp(registry);
  registerAbout(registry);
  registerProjects(registry);
  registerSkills(registry);
  registerEducation(registry);
  registerContact(registry);
  registerFs(registry);
  registerSystem(registry);
}
