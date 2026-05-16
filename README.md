# Terminal Portfolio

A terminal-style personal portfolio. ES modules, no build step, no
runtime dependencies beyond a web font. Drop-in deployable to GitHub
Pages.

## Quick start

```bash
# Local preview (any static server works)
python3 -m http.server 8000
# → http://localhost:8000

# Deploy to GitHub Pages
git init && git add -A && git commit -m "init"
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin main
# Then enable Pages in repo settings → Source: main / root
```

## What to edit

Everything visible to a visitor — name, bio, projects, skills,
contact — lives in **one file**:

```
src/config/profile.js
```

No other file needs to be touched to rebrand this portfolio.

## Project layout

```
.
├── index.html              entry — loads CSS and the main module
├── styles/
│   ├── reset.css           tiny reset
│   ├── tokens.css          design tokens (CSS variables)
│   ├── terminal.css        layout: chrome, body, status bar, prompt, output
│   └── themes.css          theme overrides applied via [data-theme]
└── src/
    ├── main.js             entry point — wires components together
    ├── config/
    │   ├── profile.js      content (single edit point)
    │   └── themes.js       theme registry
    ├── core/
    │   ├── Terminal.js     orchestrator
    │   ├── Renderer.js     every DOM write passes through here
    │   ├── Registry.js     command registration + tab completion
    │   ├── Prompt.js       input line + keybinds
    │   └── History.js      command history stack
    ├── commands/
    │   ├── index.js        central registration
    │   ├── help.js         auto-generated from registry
    │   ├── about.js        about + whoami
    │   ├── projects.js
    │   ├── skills.js
    │   ├── education.js
    │   ├── contact.js      contact + github + social alias
    │   ├── fs.js           ls + cat
    │   └── system.js       clear, theme, banner, date, history, echo
    └── utils/
        ├── dom.js          el / esc / scrollToBottom
        └── ascii.js        banner art
```

## Architecture in one paragraph

A `Terminal` coordinates four single-responsibility components — a
`Renderer` (every DOM write), a `Registry` (command storage and
tab-completion), a `History` (command stack), and a `Prompt` (input
line + keybinds). Components never call each other directly; the
`Terminal` mediates every interaction. Commands are pure modules that
register themselves with the registry and receive a context object
`{ profile, renderer, terminal }` at invocation time. This means
adding a command is just dropping in a file and adding one import.

## Adding a command

1. Create `src/commands/<name>.js`:

   ```js
   export function register(registry) {
     registry.register({
       name: 'resume',
       description: 'download my resume',
       handler: (_args, { renderer, profile }) => {
         renderer.write(renderer.link('/resume.pdf', 'resume.pdf'));
       },
     });
   }
   ```

2. Add it to `src/commands/index.js`:

   ```js
   import { register as registerResume } from './resume.js';
   // ...
   export function registerAll(registry) {
     // ...existing
     registerResume(registry);
   }
   ```

It now appears in `help`, in tab completion, and is invokable. No
other changes required.

## Adding a theme

1. Add the name to the `THEMES` array in `src/config/themes.js`.
2. Add a `.terminal[data-theme="<name>"] { ... }` block in
   `styles/themes.css`, overriding only the CSS variables that
   should change.

The `theme` command picks up the new entry automatically.

## Keybinds

| Key      | Action            |
|----------|-------------------|
| `Enter`  | Run command       |
| `↑` / `↓`| Walk history      |
| `Tab`    | Autocomplete      |
| `Ctrl+L` | Clear screen      |
| `Ctrl+C` | Cancel input line |

## Built-in commands

`help`, `about`, `whoami`, `projects`, `skills`, `education`,
`contact`, `social`, `github`, `ls`, `cat <file>`, `banner`, `theme
[name]`, `date`, `history`, `echo <text>`, `clear`.

## License

Use it, fork it, rebrand it.
