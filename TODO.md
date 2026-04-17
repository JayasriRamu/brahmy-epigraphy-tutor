# Brahmi Script Learning App - TODO List

## Project Overview
A Svelte 5 web application that teaches users the ancient Brahmi script through interactive lessons, practice games, and quizzes.

---

## Current File Structure
```
src/
├── lib/
│   ├── scripts/
│   │   ├── alphabet.ts      # Brahmi/Tamil character mappings
│   │   └── convert.ts       # Tamil to Brahmi conversion
│   └── server/
│       ├── turso.ts         # Database client
│       └── db/
│           ├── client.ts    # SQLite client
│           ├── schema.ts     # Database schema
│           ├── seed.ts       # Database seeding
│           └── index.ts     # DB exports
├── routes/
│   ├── +layout.svelte       # Global layout with nav
│   ├── +page.svelte         # Dashboard
│   ├── +page.server.ts      # Home page server
│   ├── learn/
│   │   ├── +page.svelte    # Learn page (main)
│   │   └── [id]/
│   │       ├── +page.svelte # Individual lesson
│   │       └── +page.server.ts
│   ├── practice/
│   │   └── +page.svelte    # Matching game
│   ├── quiz/
│   │   └── +page.svelte    # Quiz page
│   ├── matching/
│   │   └── [id]/
│   │       ├── +page.svelte
│   │       └── +page.server.ts
│   └── inscriptions/
│       └── [id]/
│           ├── +page.svelte
│           └── +page.server.ts
└── app.css                  # Global styles
```

---

## TODO Tasks

### Phase 1: Critical Fixes

#### 1.1 Fix LSP/TypeScript Errors
- [ ] Clear SvelteKit TypeScript cache
- [ ] Verify `BrahmiChar` interface is exported correctly
- [ ] Run `svelte-check` to confirm errors are resolved
- [ ] Test all pages compile without errors

#### 1.2 Fix Navigation Issues
- [ ] Ensure `/learn` page loads correctly
- [ ] Ensure `/practice` page loads correctly
- [ ] Ensure `/quiz` page loads correctly
- [ ] Test mobile navigation
- [ ] Verify "Exit Lesson Mode" works smoothly

#### 1.3 Database Setup
- [ ] Check if Turso credentials are configured in `.env`
- [ ] If no DB: Create mock data fallback for inscriptions
- [ ] Test inscriptions loading
- [ ] Seed database with sample Brahmi inscriptions

---

### Phase 2: Polish Existing Features

#### 2.1 Learn Page
- [ ] Polish Word Building mode UI
- [ ] Add keyboard navigation (arrow keys for lesson mode)
- [ ] Add smooth page transitions
- [ ] Improve consonant section styling

#### 2.2 Practice Page (Matching Game)
- [ ] Fix match animation timing
- [ ] Ensure sound effects work on all browsers
- [ ] Add sound toggle button
- [ ] Test on mobile devices

#### 2.3 Quiz Page
- [ ] Add timer option
- [ ] Add difficulty levels
- [ ] Polish answer feedback animations
- [ ] Add "Show Answer" hint option

---

### Phase 3: New Features

#### 3.1 Progress Tracking
- [ ] Add localStorage for saving progress
- [ ] Track matched pairs statistics
- [ ] Track quiz scores
- [ ] Add "Reset Progress" option

#### 3.2 User Experience
- [ ] Add sound effects toggle (muted by default)
- [ ] Add dark/light theme toggle
- [ ] Add keyboard shortcuts
- [ ] Add loading skeletons

#### 3.3 Content Expansion
- [ ] Add more sample words for Word Building
- [ ] Add historical context for Brahmi script
- [ ] Add pronunciation guides

---

### Phase 4: Testing & Deployment

#### 4.1 Testing
- [ ] Run `npm run build` successfully
- [ ] Test all routes work
- [ ] Test responsive design
- [ ] Test accessibility (screen readers)

#### 4.2 Deployment
- [ ] Set up environment variables
- [ ] Deploy to production
- [ ] Test production build

---

## Commands to Run

```bash
# Development
npm run dev

# Type Check
npm run check

# Build
npm run build

# Preview Production
npm run preview

# Clear Cache
rm -rf node_modules/.cache
```

---

## Notes
- LSP errors are likely stale cache issues
- All pages use Svelte 5 runes syntax ($state, $derived, $effect)
- Design uses Tailwind CSS with custom glassmorphism styles
- Sound effects use Web Audio API

---

## Priority Order
1. Fix LSP errors (blocking development)
2. Fix navigation issues (critical UX)
3. Polish Practice page
4. Polish Learn page
5. Add Quiz features
6. Add progress tracking
7. Test and deploy
