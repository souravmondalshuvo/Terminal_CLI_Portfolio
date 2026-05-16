import { Terminal } from './core/Terminal.js';
import { profile } from './config/profile.js';
import { BANNER } from './utils/ascii.js';
import { registerAll } from './commands/index.js';

const terminal = new Terminal({
  rootEl: document.getElementById('terminal'),
  profile,
  banner: BANNER,
});

terminal.use(registerAll).boot();
