/**
 * DOM utilities. Pure helpers — no module-level side effects.
 */

/**
 * Create an element with optional className and innerHTML.
 * @param {string} tag
 * @param {string} [className]
 * @param {string} [html]
 * @returns {HTMLElement}
 */
export function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

/**
 * Escape a value for safe insertion into HTML.
 * All user-derived strings MUST pass through this before being
 * concatenated into innerHTML.
 * @param {*} value
 * @returns {string}
 */
export function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

/**
 * Scroll an element to the bottom on the next frame.
 * @param {HTMLElement} node
 */
export function scrollToBottom(node) {
  requestAnimationFrame(() => {
    node.scrollTop = node.scrollHeight;
  });
}
