import { el } from '../utils/dom.js';

/**
 * Prompt
 *
 * Renders and manages a single input row (the live prompt). It owns
 * the DOM input element and recognises keybinds, but defers every
 * outcome to the Terminal via callbacks. This keeps Prompt thin and
 * free of cross-cutting knowledge (history mgmt, completion logic,
 * rendering of results all live elsewhere).
 *
 * Callbacks:
 *   onSubmit(value, prompt)    — Enter pressed
 *   onTab(value, prompt)       — Tab pressed (terminal handles 0/1/N matches)
 *   onClear(prompt)            — Ctrl+L
 *   onInterrupt(value, prompt) — Ctrl+C
 *   onHistoryPrev(prompt)      — ArrowUp
 *   onHistoryNext(prompt)      — ArrowDown
 */
export class Prompt {
  /**
   * @param {object} opts
   * @param {string} opts.user
   * @param {string} opts.host
   * @param {string} [opts.path='~']
   * @param {Function} opts.onSubmit
   * @param {Function} opts.onTab
   * @param {Function} opts.onClear
   * @param {Function} opts.onInterrupt
   * @param {Function} opts.onHistoryPrev
   * @param {Function} opts.onHistoryNext
   */
  constructor(opts) {
    this.opts = { path: '~', ...opts };
    this.input = null;
    this.row = null;
    this.locked = false;
  }

  /** Build the prompt DOM and append it to `parent`. */
  mount(parent) {
    const row = el('div', 'prompt-line');
    row.innerHTML = this._promptHTML();

    const wrap = el('div', 'input-wrap');
    const input = document.createElement('input');
    input.className = 'cmd-input';
    input.type = 'text';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-label', 'terminal input');
    input.addEventListener('keydown', (ev) => this._onKey(ev));

    wrap.appendChild(input);
    row.appendChild(wrap);
    parent.appendChild(row);

    this.row = row;
    this.input = input;
    this.focus();
    return this;
  }

  /** Freeze the current input into static text. Idempotent. */
  lock(displayValue) {
    if (this.locked || !this.input) return;
    const parent = this.input.parentElement;
    const span = document.createElement('span');
    span.className = 'typed';
    span.textContent = displayValue ?? this.input.value;
    parent.replaceChild(span, this.input);
    this.input = null;
    this.locked = true;
  }

  focus() {
    this.input?.focus({ preventScroll: true });
  }

  getValue() {
    return this.input?.value ?? '';
  }

  setValue(value) {
    if (!this.input) return;
    this.input.value = value;
    // Move caret to end on next tick so the browser settles first.
    setTimeout(() => {
      this.input?.setSelectionRange(value.length, value.length);
    }, 0);
  }

  _promptHTML() {
    const { user, host, path } = this.opts;
    const escAttr = (s) => String(s).replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`);
    return (
      '<span class="prompt">' +
      `<span class="prompt__user">${escAttr(user)}</span>` +
      '<span class="prompt__sep">@</span>' +
      `<span class="prompt__host">${escAttr(host)}</span>` +
      '<span class="prompt__sep">:</span>' +
      `<span class="prompt__path">${escAttr(path)}</span>` +
      '<span class="prompt__sigil">$</span>' +
      '</span>'
    );
  }

  _onKey(ev) {
    const k = ev.key;

    if (k === 'Enter') {
      ev.preventDefault();
      this.opts.onSubmit?.(this.getValue(), this);
      return;
    }
    if (k === 'ArrowUp') {
      ev.preventDefault();
      this.opts.onHistoryPrev?.(this);
      return;
    }
    if (k === 'ArrowDown') {
      ev.preventDefault();
      this.opts.onHistoryNext?.(this);
      return;
    }
    if (k === 'Tab') {
      ev.preventDefault();
      this.opts.onTab?.(this.getValue(), this);
      return;
    }
    if (k.toLowerCase() === 'l' && (ev.ctrlKey || ev.metaKey)) {
      ev.preventDefault();
      this.opts.onClear?.(this);
      return;
    }
    if (k.toLowerCase() === 'c' && ev.ctrlKey) {
      ev.preventDefault();
      this.opts.onInterrupt?.(this.getValue(), this);
      return;
    }
  }
}
