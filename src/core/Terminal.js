import { Renderer } from './Renderer.js';
import { Registry } from './Registry.js';
import { History } from './History.js';
import { Prompt } from './Prompt.js';
import { esc } from '../utils/dom.js';

/**
 * Terminal
 *
 * Orchestrator that ties the components together. Each subsystem stays
 * unaware of the others; the Terminal mediates every interaction.
 *
 *   Prompt   ──onSubmit──▶   Terminal.run()  ──▶  Registry → handler
 *   Prompt   ──onTab─────▶   Terminal._tab()
 *   Prompt   ──↑/↓───────▶   Terminal._historyStep()
 *
 * Handlers receive a `Context` ({ profile, renderer, terminal })
 * which exposes everything they need without globals.
 */
export class Terminal {
  /**
   * @param {object} opts
   * @param {HTMLElement} opts.rootEl   the `.terminal` element
   * @param {object} opts.profile       all personal content
   * @param {string} opts.banner        ASCII banner to print on boot
   */
  constructor({ rootEl, profile, banner }) {
    this.rootEl   = rootEl;
    this.bodyEl   = rootEl.querySelector('[data-body]');
    this.statusEl = rootEl.querySelector('[data-status-path]');
    this.profile  = profile;
    this.banner   = banner;

    this.renderer = new Renderer(this.bodyEl);
    this.registry = new Registry();
    this.history  = new History();
    this.prompt   = null;

    this._installGlobalHandlers();
  }

  /**
   * Apply a registrar — a function `(registry) => void` that adds
   * commands. Returns `this` for chaining: `term.use(registerAll).boot()`.
   */
  use(registrar) {
    registrar(this.registry);
    return this;
  }

  /** Print welcome message and spawn the first prompt. */
  boot() {
    this._printWelcome();
    this._spawnPrompt();
  }

  /**
   * Execute a raw command line. Pushes to history, resolves via the
   * registry, and invokes the handler with a fresh context.
   */
  run(line) {
    const text = line.trim();
    if (!text) return;
    this.history.push(text);

    const { name, cmd, args } = this.registry.resolve(text);
    if (!cmd) {
      this.renderer.error(`command not found: ${name}`, '— type help');
      return;
    }
    try {
      cmd.handler(args, this._ctx());
    } catch (e) {
      this.renderer.error(`${name}: ${e.message ?? 'error'}`);
    }
  }

  /** Apply a theme by setting `data-theme` on the root. */
  setTheme(name) {
    if (name === 'default') delete this.rootEl.dataset.theme;
    else this.rootEl.dataset.theme = name;
  }

  getTheme() {
    return this.rootEl.dataset.theme || 'default';
  }

  /** Public: clear the body. Commands call this via ctx.terminal.clear(). */
  clear() {
    this.renderer.clear();
  }

  // ── internals ────────────────────────────────────────────────

  _ctx() {
    return {
      profile:  this.profile,
      renderer: this.renderer,
      terminal: this,
    };
  }

  _printWelcome() {
    const { profile, banner } = this;
    this.renderer.muted(`Last login: ${this._loginTimestamp()} on ttys001`);
    this.renderer.blank();
    this.renderer.write(banner, 'banner');
    this.renderer.blank();
    this.renderer.write(
      `Welcome. Connected as ` +
      `<span class="prompt__user">${esc(profile.handle)}</span>` +
      `<span class="muted">@</span>` +
      `<span class="prompt__host">${esc(profile.host)}</span>.`
    );
    this.renderer.muted(`${profile.name} · ${profile.role} · ${profile.location}`);
    this.renderer.blank();
    this.renderer.write(
      `Type <span class="key">help</span> to list commands. ` +
      `Try <span class="key">projects</span> or <span class="key">about</span>.`
    );
    this.renderer.blank();
  }

  /** Unix-style timestamp: "Mon May 18 12:22:14 2026" */
  _loginTimestamp() {
    const [day, mon, dd, time, year] = new Date().toString().split(' ');
    return `${day} ${mon} ${dd} ${time} ${year}`;
  }

  _spawnPrompt() {
    this.prompt = new Prompt({
      user: this.profile.handle,
      host: this.profile.host,
      path: '~',
      onSubmit:       (value, p) => this._onSubmit(value, p),
      onTab:          (value, p) => this._onTab(value, p),
      onClear:        (p)        => this._onClear(p),
      onInterrupt:    (value, p) => this._onInterrupt(value, p),
      onHistoryPrev:  (p)        => this._historyStep('prev', p),
      onHistoryNext:  (p)        => this._historyStep('next', p),
    });
    this.prompt.mount(this.bodyEl);
  }

  _onSubmit(value, prompt) {
    prompt.lock(value);
    this.run(value);
    this._spawnPrompt();
  }

  _onTab(value, prompt) {
    const partial = value.trim().toLowerCase();
    if (!partial) return;
    const matches = this.registry.complete(partial);
    if (matches.length === 1) {
      prompt.setValue(matches[0] + ' ');
    } else if (matches.length > 1) {
      prompt.lock(value);
      this.renderer.write(
        matches.map((m) => `<span class="key">${esc(m)}</span>`).join('   ')
      );
      this._spawnPrompt();
      this.prompt.setValue(value);
    }
  }

  _onClear(_prompt) {
    this.clear();
    this._spawnPrompt();
  }

  _onInterrupt(value, prompt) {
    prompt.lock(value + '^C');
    this._spawnPrompt();
  }

  _historyStep(direction, prompt) {
    const value = direction === 'prev' ? this.history.prev() : this.history.next();
    if (value !== undefined) prompt.setValue(value);
  }

  /** Click anywhere → focus prompt (but don't steal anchor clicks). */
  _installGlobalHandlers() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      this.prompt?.focus();
    });
    // Prevent Tab from leaving the input
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && this.prompt && document.activeElement !== this.prompt.input) {
        e.preventDefault();
        this.prompt.focus();
      }
    });
  }
}