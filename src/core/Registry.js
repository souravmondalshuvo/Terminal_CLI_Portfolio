/**
 * Registry
 *
 * A pure storage layer for commands and aliases. Knows nothing about
 * the DOM, the renderer, or the terminal — it just stores definitions
 * and answers queries (resolve, complete, list).
 *
 * Command shape:
 *   {
 *     name:        string,
 *     description: string,
 *     handler:     (args: string[], ctx: Context) => void,
 *     usage?:      string,     // shown in help next to name
 *     hidden?:     boolean,    // excluded from help + completion
 *   }
 */
export class Registry {
  constructor() {
    /** @type {Map<string, object>} */
    this.commands = new Map();
    /** @type {Map<string, string>} */
    this.aliases = new Map();
  }

  /**
   * Register a command. Insertion order is preserved (Map semantics),
   * which `list()` relies on to render `help` deterministically.
   */
  register(def) {
    if (!def?.name) throw new Error('Registry.register: name is required');
    if (typeof def.handler !== 'function') {
      throw new Error(`Registry.register(${def.name}): handler must be a function`);
    }
    this.commands.set(def.name, {
      name: def.name,
      description: def.description ?? '',
      usage: def.usage ?? '',
      hidden: !!def.hidden,
      handler: def.handler,
    });
    return this;
  }

  /** Register `from` as an alias of `to`. Aliases don't appear in help. */
  alias(from, to) {
    if (!this.commands.has(to)) {
      throw new Error(`Registry.alias: target '${to}' is not registered`);
    }
    this.aliases.set(from, to);
    return this;
  }

  /** Resolve a name (or alias) to a command definition, or null. */
  get(name) {
    const canonical = this.aliases.get(name) ?? name;
    return this.commands.get(canonical) ?? null;
  }

  /** All non-hidden commands, in registration order. */
  list() {
    return [...this.commands.values()].filter((c) => !c.hidden);
  }

  /**
   * Parse a raw input line into a resolved command.
   * @param {string} line
   * @returns {{ name: string, cmd: object|null, args: string[] }}
   */
  resolve(line) {
    const tokens = line.trim().split(/\s+/);
    const name = (tokens[0] ?? '').toLowerCase();
    const args = tokens.slice(1);
    return { name, cmd: this.get(name), args };
  }

  /**
   * Tab completion. Matches commands and aliases by prefix.
   * @param {string} partial  already lower-cased and trimmed
   * @returns {string[]}      sorted, unique matches
   */
  complete(partial) {
    if (!partial) return [];
    const visible = [...this.commands.values()]
      .filter((c) => !c.hidden)
      .map((c) => c.name);
    const pool = [...new Set([...visible, ...this.aliases.keys()])];
    return pool.filter((n) => n.startsWith(partial)).sort();
  }
}
