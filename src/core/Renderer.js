import { el, esc, scrollToBottom } from '../utils/dom.js';

/**
 * Renderer
 *
 * Owns every write to the terminal body. Centralising this means:
 *  - One place to enforce HTML escaping conventions
 *  - One place to control animation, scroll behaviour, layout classes
 *  - Commands stay declarative; they describe content, not DOM mechanics
 *
 * Public API is intentionally small and high-level (heading, block, kv).
 * Commands should NOT reach into the body directly.
 */
export class Renderer {
  /** @param {HTMLElement} root */
  constructor(root) {
    this.root = root;
  }

  /**
   * Write a raw HTML line. Caller is responsible for escaping any
   * user-derived substrings — use `esc()` from utils/dom.
   * @param {string} html
   * @param {string} [cls='line']
   */
  write(html, cls = 'line') {
    const node = el('div', cls, html);
    this.root.appendChild(node);
    scrollToBottom(this.root);
    return node;
  }

  /** Write an escaped plain-text line. */
  text(value) {
    return this.write(esc(value));
  }

  /** Empty visual row. */
  blank() {
    return this.write('&nbsp;');
  }

  /** Muted text line (escaped). */
  muted(value) {
    return this.write(`<span class="muted">${esc(value)}</span>`);
  }

  /** Error line (escaped) with optional muted suffix. */
  error(message, suffix = '') {
    const suf = suffix ? ` <span class="muted">${esc(suffix)}</span>` : '';
    return this.write(`<span class="err">${esc(message)}</span>${suf}`);
  }

  /** Section heading. */
  heading(text) {
    return this.write(`<span class="h">${esc(text)}</span>`);
  }

  /** Accent line — used for names, project titles, etc. */
  accent(text, prefix = '') {
    return this.write(
      `${prefix ? esc(prefix) : ''}<span class="accent">${esc(text)}</span>`
    );
  }

  /**
   * Render a labelled key/value block.
   * @param {Array<[string, string]>} rows  raw HTML in values
   */
  block(rows) {
    const wrap = el('div', 'block');
    rows.forEach(([label, valueHtml]) => {
      const row = el('div', 'row');
      row.innerHTML =
        `<span class="row__label">${esc(label)}</span>` +
        `<span class="row__value">${valueHtml}</span>`;
      wrap.appendChild(row);
    });
    this.root.appendChild(wrap);
    scrollToBottom(this.root);
    return wrap;
  }

  /** Inline pill list, separated by a dim mid-dot. */
  pills(items) {
    return items
      .map((s) => `<span class="key">${esc(s)}</span>`)
      .join('<span class="dim-sep">·</span>');
  }

  /** Anchor element (opens in new tab for external URLs). */
  link(href, label = href, external = true) {
    const safeHref = esc(href);
    const target = external ? ' target="_blank" rel="noopener"' : '';
    return `<a class="link" href="${safeHref}"${target}>${esc(label)}</a>`;
  }

  /** Wipe the body. */
  clear() {
    this.root.innerHTML = '';
  }
}
