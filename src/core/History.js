/**
 * History — bash-style command history.
 *
 * Cursor sits one past the last entry by default. `prev()` walks
 * backwards, `next()` walks forwards and returns '' when off the end
 * (matching the empty input state of a real shell).
 */
export class History {
  constructor() {
    /** @type {string[]} */
    this.stack = [];
    this.cursor = 0;
  }

  /** Append a command and reset the cursor to "one past the end". */
  push(line) {
    const trimmed = line.trim();
    if (!trimmed) return;
    // De-dupe consecutive identical entries (also bash behaviour)
    if (this.stack[this.stack.length - 1] !== trimmed) {
      this.stack.push(trimmed);
    }
    this.cursor = this.stack.length;
  }

  /** Walk one step back. Returns undefined when already at the top. */
  prev() {
    if (this.stack.length === 0) return undefined;
    this.cursor = Math.max(0, this.cursor - 1);
    return this.stack[this.cursor];
  }

  /** Walk one step forward. Returns '' when off the end. */
  next() {
    if (this.stack.length === 0) return undefined;
    this.cursor = Math.min(this.stack.length, this.cursor + 1);
    return this.stack[this.cursor] ?? '';
  }

  /** Defensive copy of the full stack. */
  all() {
    return this.stack.slice();
  }

  size() {
    return this.stack.length;
  }
}
