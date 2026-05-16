/**
 * ═══════════════════════════════════════════════════════════════════
 *  PROFILE — single source of truth for the portfolio's content.
 *
 *  Everything visible to a visitor is derived from this object.
 *  No logic lives here; the rest of the codebase does not know about
 *  the specific shape of any field beyond what is documented here.
 *
 *  To customise the portfolio for someone else, this is the only
 *  file you need to edit.
 * ═══════════════════════════════════════════════════════════════════
 */
export const profile = {
  // Shown in the prompt: `user@host:~$`
  handle:   'sourav',
  host:     'portfolio',

  // Header / about
  name:     'Sourav Mondal',
  role:     'CSE Undergraduate · Solo Developer',
  location: 'Dhaka, Bangladesh',
  tagline:  'I build software end-to-end and ship it.',

  // Used by `about` — array of lines (empty string = blank line)
  bio: [
    "I'm a Computer Science undergraduate at BRAC University and the solo",
    "developer behind Shohoj — a comprehensive academic planning platform",
    "built specifically for BRACU students. I work end-to-end: frontend,",
    "backend, security, testing, and deployment.",
    "",
    "Strong bias toward shipping over perfecting. I care about getting",
    "things into users' hands and iterating from there.",
  ],

  // Used by `education`
  education: [
    {
      period: '2022 — Present',
      degree: 'B.Sc. in Computer Science & Engineering',
      org:    'BRAC University, Dhaka',
    },
  ],

  // Used by `skills` — keys are category labels
  skills: {
    languages: ['JavaScript', 'Python', 'HTML/CSS'],
    frontend:  ['ES Modules', 'Vanilla JS', 'pdf.js', 'jsPDF', 'Canvas'],
    backend:   ['Firebase Auth', 'Firestore', 'Security Rules'],
    security:  ['XSS prevention', 'CSP', 'Input sanitization'],
    tooling:   ['Git / GitHub', 'GitHub Actions CI', 'Custom build scripts'],
    practices: ['Test-driven dev', 'Refactoring', 'Mobile UX'],
  },

  // Used by `projects` — order is preserved
  projects: [
    {
      name:  'Shohoj (সহজ)',
      year:  '2024 — Present',
      stack: 'JavaScript · Firebase · pdf.js',
      desc:
        'Academic planning platform for BRAC University students. CGPA ' +
        'calculator, semester planner with prerequisite checking, transcript ' +
        'PDF import, and a 774-course catalog across 16 departments. Phase 1 ' +
        'of a 6-phase university-life platform.',
      link: 'https://souravmondalshuvo.github.io/Shohoj',
      repo: 'https://github.com/souravmondalshuvo/Shohoj',
    },
    {
      name:  'Chillox Web',
      year:  '2024',
      stack: 'HTML · CSS · JavaScript',
      desc:
        'Brand-driven restaurant website. Single-page experience focused on ' +
        'menu and identity.',
      link: '',
      repo: '',
    },
  ],

  // Used by `contact`
  contact: {
    email:    'you@example.com',                            // ← swap in
    github:   'https://github.com/souravmondalshuvo',
    location: 'Dhaka, Bangladesh',
  },
};
