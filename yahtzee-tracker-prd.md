# Product Requirements Document
## Yahtzee Score Tracker

**Version:** 1.0  
**Date:** January 19, 2026  
**Status:** Draft  
**License:** MIT (or your choice)  
**Open Source:** Yes, 100% free forever

---

## Why Build This?

**The Problem:**
Paper Yahtzee scorecards are fine, but they're messy, easy to lose, and not particularly inspiring. Most digital alternatives are either cluttered with ads or have boring, generic designs.

**The Opportunity:**
- Create something beautiful that proves utility apps can be art
- Learn real-time web development in a fun, low-stakes project
- Build a portfolio piece that showcases both design and technical skills
- Give back to the board game community with a free, open source tool
- Explore bold graphic design inspired by CMYK Games' aesthetic

**Personal Goals:**
- [Add your own! Why are YOU building this?]
- Example: "I want to get better at React"
- Example: "I love Yahtzee and want something pretty on game night"
- Example: "I want to practice designing with bold color"

---

## 1. Executive Summary

An open source, web-based Yahtzee score tracking application that replaces traditional paper scoresheets with a bold, graphic digital experience. The app supports both single-device multiplayer and multi-device session-based gameplay, featuring a design aesthetic inspired by CMYK Games' Swiss-style approach with bold colors, oversized typography, and minimal UI elements.

**Project Goals:**
- Create a beautiful, functional tool that makes Yahtzee more enjoyable
- Explore bold graphic design in a web application
- Learn real-time multiplayer development techniques
- Build a portfolio piece that showcases design and development skills
- Share freely with the board game community

**Key Features:**
- Dual-mode gameplay (single device OR multi-device sessions)
- Bold, design-forward aesthetic that stands out from typical score tracking apps
- Real-time synchronization across devices
- Progressive web app (PWA) for mobile and desktop
- 100% free, no ads, no tracking, no monetization

---

## 2. Product Vision

**Vision Statement:**  
An open source digital tool that celebrates bold graphic design while making Yahtzee score tracking effortless and delightful.

**Project Philosophy:**
- **Design-first:** Prove that utility apps can be beautiful
- **Open & Free:** No paywalls, no ads, no tracking—just a great tool for game night
- **Learn by Building:** A project to explore modern web tech and design systems
- **Community-driven:** Open to contributions and feedback from anyone

**Target Audience:**
- Board game enthusiasts who appreciate design
- Groups playing Yahtzee in person (family game nights, parties)
- Designers looking for inspiration or to contribute
- Developers interested in learning real-time web apps
- Anyone who wants a better alternative to paper scorecards

---

## 3. Design Philosophy

### 3.1 CMYK Games Aesthetic Principles

**Core Visual Language:**
- **Bold Swiss Typography:** Large-scale, high-contrast white type on vibrant backgrounds
- **Minimal UI:** Strip away unnecessary elements; every pixel serves a purpose
- **Bright Color Blocking:** Saturated, bold colors (think: electric blue, hot magenta, bright yellow, vivid orange)
- **Graphic Shapes:** Clean geometric forms, strong borders, intentional negative space
- **Tactile Feel:** Despite being digital, maintain a sense of physicality through scale and weight

**Typography Hierarchy:**
```
Primary: Instrument Serif (Headlines, Numbers, Game State)
- Use cases: Player names, scores, category labels, big numbers
- Sizes: 48-120px for critical info

Secondary: Albert Sans (UI labels, buttons, supporting text)
- Use cases: Instructions, button labels, helper text
- Sizes: 14-24px for UI elements
```

**Color Strategy:**
- **Background Colors:** Rotate between bold primaries and secondaries
  - Electric Blue (#0066FF)
  - Hot Magenta (#FF0099)
  - Bright Yellow (#FFDD00)
  - Vivid Orange (#FF6600)
  - Deep Purple (#6600CC)
  
- **Text:** Always white (#FFFFFF) for maximum contrast
- **Accents:** Black (#000000) for borders, dividers, and emphasis
- **State Colors:**
  - Active/Selected: Bright Green (#00FF66)
  - Disabled: 40% opacity of background color
  - Error: Bright Red (#FF0033)

**Layout Principles:**
- Large tap targets (minimum 60px x 60px)
- Generous padding and margins (16-32px)
- Strong visual hierarchy through size, not subtlety
- Grid-based layouts with clear alignment
- Bold borders (4-8px) to define zones

### 3.2 Design Inspiration Notes

Based on CMYK Games' approach:
- **Wavelength:** Bold stripes, minimal type, 70s palette
- **Figment:** Color-focused, aesthetic and cooperative feel
- **I'm Out:** Simple rules presentation, clear hierarchy
- **General CMYK Style:** "Opinionated, polished visual design" that "stands out like a beacon"

---

## 4. User Stories & Use Cases

### 4.1 Core User Stories

**Single Device Mode:**
- As a game host, I want to track scores for all players on my phone so everyone can focus on playing
- As a player, I want to see my current score and potential scoring options at a glance
- As a group, we want to pass around one device to enter scores quickly

**Multi-Device Mode:**
- As a player, I want to enter my own scores on my phone so I have autonomy over my gameplay
- As a game host, I want to create a session and share a join code so others can connect
- As all players, we want to see real-time score updates so we know the current standings
- As a player, I want to see everyone's scores even when entering my own

**Universal:**
- As a player, I want clear indication of which scoring categories are available
- As a player, I want to see the rules for each Yahtzee category
- As a group, we want to know who's winning at a glance
- As a player, I want to undo my last entry if I made a mistake

### 4.2 User Flows

**Flow 1: Single Device Game**
```
1. Home screen → Select "Single Device"
2. Enter player names (2-6 players)
3. Assign each player a color
4. Game screen displays first player's turn
5. Player enters score for category
6. Auto-advance to next player
7. Complete 13 rounds
8. Display winner with animation
```

**Flow 2: Multi-Device Session**
```
Host Flow:
1. Home screen → Select "Multi-Device Host"
2. Enter number of players
3. Generate session code (6-character)
4. Display code prominently
5. Wait for players to join
6. Start game when all joined

Player Flow:
1. Home screen → Select "Join Game"
2. Enter session code
3. Enter player name
4. Wait for host to start
5. See personal scorecard
6. Enter scores when it's your turn
```

---

## 5. Feature Requirements

### 5.1 MVP Features (Phase 1)

#### 5.1.1 Game Setup
- [ ] Choose between Single Device or Multi-Device mode
- [ ] Enter 2-6 player names
- [ ] Assign distinct colors to each player
- [ ] Simple onboarding/rules explanation (optional view)

#### 5.1.2 Score Entry
- [ ] Display all 13 Yahtzee categories:
  - Upper Section: Ones, Twos, Threes, Fours, Fives, Sixes
  - Lower Section: 3-of-a-kind, 4-of-a-kind, Full House, Small Straight, Large Straight, Yahtzee, Chance
- [ ] Tap category to enter score
- [ ] Number pad input for score entry
- [ ] Automatic score validation (e.g., Full House must be 25 or 0)
- [ ] Visual indication of used vs. available categories
- [ ] "Zero out" option for categories (intentional 0)

#### 5.1.3 Score Display
- [ ] Current round indicator (Round 1 of 13)
- [ ] Individual player scores
- [ ] Upper section bonus tracking (35 points if ≥63)
- [ ] Running total for each player
- [ ] Current turn indicator
- [ ] Leaderboard ranking

#### 5.1.4 Multi-Device Session
- [ ] Generate unique 6-character session code
- [ ] Join session via code entry
- [ ] Real-time score synchronization
- [ ] Connection status indicator
- [ ] Player join/leave notifications
- [ ] Session timeout after 2 hours of inactivity

#### 5.1.5 Game Completion
- [ ] Winner announcement screen
- [ ] Final scores breakdown
- [ ] Option to play again (new game)
- [ ] Option to review completed scorecard

#### 5.1.6 Technical Foundation
- [ ] Responsive design (mobile-first, works on desktop)
- [ ] PWA capabilities (installable, offline-ready for single device)
- [ ] WebSocket connection for multi-device (or Firebase Realtime DB)
- [ ] Local storage for saving in-progress games
- [ ] Clean URL structure for session joining

### 5.2 Future Enhancements (Phase 2)

#### 5.2.1 Illustrations & Polish
- [ ] Hand-drawn/vector dice illustrations
- [ ] Animated transitions between turns
- [ ] Celebration animations for Yahtzee rolls
- [ ] Custom illustrations for each category
- [ ] Particle effects for winner announcement

#### 5.2.2 Game Features
- [ ] Undo last entry
- [ ] Game history/statistics
- [ ] Multiple Yahtzee bonus tracking (100 points each)
- [ ] House rules toggle (Joker rules, forced play)
- [ ] Multiple concurrent games
- [ ] Custom player avatars

#### 5.2.3 Social Features
- [ ] Shareable game results
- [ ] QR code for session joining
- [ ] Voice chat integration
- [ ] GIF reactions when someone enters a score

#### 5.2.4 Accessibility
- [ ] High contrast mode
- [ ] Screen reader support
- [ ] Adjustable text size
- [ ] Colorblind-friendly mode

---

## 6. Technical Requirements

### 6.1 Technology Stack (Recommended)

**Keep It Simple:**
This is designed to be built by one person as a learning project. Choose tools you're comfortable with or want to learn.

**Frontend:**
- **Framework:** React (via Vite or Create React App)
  - *Why:* Popular, lots of tutorials, good for learning
  - *Alternative:* Vanilla JS if you want to keep it ultra-simple
- **Styling:** Tailwind CSS + custom CSS
  - *Why:* Fast to prototype, utility-first matches the bold aesthetic
  - *Alternative:* Plain CSS with CSS variables for design tokens
- **Typography:** 
  - Instrument Serif: Google Fonts (free)
  - Albert Sans: Google Fonts (free)
- **State Management:** React Context or Zustand
  - *Why:* Built-in or lightweight, no need for Redux
- **Routing:** React Router (if multi-page) or single page app

**Backend/Real-time (Choose ONE):**
- **Recommended for Beginners:** Firebase
  - ✅ No server code needed
  - ✅ Real-time database built-in
  - ✅ Free hosting included
  - ✅ Excellent documentation
  - ❌ More "magic," less control
  
- **Recommended for Learning:** Supabase
  - ✅ Open source
  - ✅ SQL database (more transferable skill)
  - ✅ Real-time subscriptions
  - ✅ Self-hostable if you outgrow free tier
  - ❌ Slightly more setup

**Deployment (All Free):**
- **Hosting:** Vercel, Netlify, or Firebase Hosting
- **No backend server needed** (use Firebase/Supabase for data)
- **PWA:** Just add a manifest.json and service-worker.js

**Development Tools:**
- **Code Editor:** VS Code (free)
- **Version Control:** Git + GitHub (free, public repo)
- **Design:** Figma (free tier, or just sketch on paper first!)
- **Testing:** Test with friends, no fancy tools needed for MVP

**Backend/Real-time (Free Tier Options):**
- **Option 1 (Recommended):** Firebase
  - Realtime Database for live score sync
  - Firebase Hosting for deployment
  - **Free tier:** 100 simultaneous connections, 1GB storage, 10GB/month transfer
  - **Why:** Zero config, great docs, generous free tier
  
- **Option 2:** Supabase
  - PostgreSQL database
  - Real-time subscriptions
  - **Free tier:** 500MB database, 2GB bandwidth, 50,000 monthly active users
  - **Why:** Open source, SQL database, more control

**Deployment (All Free):**
- **Hosting:** Vercel (recommended), Netlify, or Firebase Hosting
- **Domain:** Free subdomain (yourapp.vercel.app) or buy custom ($10-15/year)
- **PWA:** Service worker for offline capability
- **CI/CD:** GitHub Actions (free for public repos)

### 6.2 Data Models

#### Session Object
```typescript
interface Session {
  id: string;                    // 6-character code
  createdAt: timestamp;
  players: Player[];
  currentPlayerIndex: number;
  currentRound: number;          // 1-13
  status: 'waiting' | 'active' | 'completed';
  mode: 'single' | 'multi';
}
```

#### Player Object
```typescript
interface Player {
  id: string;
  name: string;
  color: string;                 // Hex color
  scorecard: Scorecard;
  totalScore: number;
  isConnected?: boolean;         // Multi-device only
}
```

#### Scorecard Object
```typescript
interface Scorecard {
  // Upper section
  ones: number | null;
  twos: number | null;
  threes: number | null;
  fours: number | null;
  fives: number | null;
  sixes: number | null;
  upperBonus: number;            // Auto-calculated
  
  // Lower section
  threeOfKind: number | null;
  fourOfKind: number | null;
  fullHouse: number | null;
  smallStraight: number | null;
  largeStraight: number | null;
  yahtzee: number | null;
  chance: number | null;
  
  // Total
  total: number;                 // Auto-calculated
}
```

### 6.3 Performance Requirements

**Realistic Goals for Free Tier:**
- **Load Time:** <3 seconds on 4G connection (free hosting can be slower)
- **Real-time Sync:** <1000ms latency (Firebase/Supabase free tier)
- **Offline Support:** Single device mode works without internet
- **Session Capacity:** 2-6 players per session (design limit)
- **Concurrent Sessions:** Free tier supports 50-100+ simultaneous games (more than enough!)

**Notes:**
- Free hosting is slightly slower than paid, but totally acceptable
- Firebase free tier: 100 simultaneous connections
- Supabase free tier: 500MB database, plenty for sessions
- Most games will be small friend groups, not hundreds of players

### 6.4 Browser Support

- **Mobile:** iOS Safari 14+, Chrome Mobile 90+
- **Desktop:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Web App:** Installable on iOS and Android

---

## 7. UI/UX Specifications

### 7.1 Key Screens (MVP)

#### Screen 1: Home / Mode Select
**Layout:**
- Full-screen bold color background
- Centered content
- Large title: "YAHTZEE" (Instrument Serif, 96px)
- Two large buttons:
  - "SINGLE DEVICE" (full width, 80px height)
  - "MULTI DEVICE" (full width, 80px height)
- Button style: White text on semi-transparent black (20% opacity)
- Active state: Solid black background

**Interactions:**
- Tap button → Navigate to respective setup flow
- Smooth fade transition between screens

---

#### Screen 2A: Single Device Setup
**Layout:**
- Bold color background (different from home)
- Title: "PLAYERS" (Instrument Serif, 64px)
- Player name inputs (2-6):
  - Text input fields (white border, 4px, transparent fill)
  - Player number indicator (colored circle)
  - Auto-assign colors: rotate through palette
- "START GAME" button (bottom, full width)

**Interactions:**
- Enter key or "Next" on keyboard moves to next input
- Must have at least 2 players to start
- Disabled state for start button if <2 players

---

#### Screen 2B: Multi-Device Host Setup
**Layout:**
- Bold color background
- Title: "SESSION CODE" (Instrument Serif, 48px)
- Giant 6-character code (Instrument Serif, 120px, letter-spacing)
- QR code (optional, Phase 2)
- List of joined players (scrollable)
- "START GAME" button (disabled until all players joined)

**Interactions:**
- Code is auto-generated and displayed
- Players appear in list as they join
- Start button activates when ≥2 players joined

---

#### Screen 2C: Multi-Device Join
**Layout:**
- Bold color background
- Title: "JOIN GAME" (Instrument Serif, 64px)
- 6-character code input (large, monospace style)
- Name input field
- "JOIN" button

**Interactions:**
- Auto-focus on code input
- Code validation (must exist)
- Error message if session not found
- Auto-advance to waiting screen on success

---

#### Screen 3: Game Board (Single Device)
**Layout:**
```
┌─────────────────────────────┐
│  ROUND 3 / 13               │ ← Small header (Albert Sans)
│                              │
│  ★ MAYA                      │ ← Current player (Instrument Serif, 48px)
│  128 pts                     │ ← Current score (Albert Sans, 24px)
│                              │
│  ┌──────────────────────┐   │
│  │ UPPER SECTION         │   │
│  │                       │   │
│  │ ONES          ✓  3    │   │ ← Completed (checkmark + score)
│  │ TWOS          ✓  6    │   │
│  │ THREES            →   │   │ ← Available (arrow indicator)
│  │ FOURS             →   │   │
│  │ FIVES             →   │   │
│  │ SIXES             →   │   │
│  │ BONUS        12/63    │   │ ← Bonus progress
│  │                       │   │
│  │ LOWER SECTION         │   │
│  │                       │   │
│  │ 3 OF KIND         →   │   │
│  │ 4 OF KIND         →   │   │
│  │ FULL HOUSE        →   │   │
│  │ SM STRAIGHT       →   │   │
│  │ LG STRAIGHT       →   │   │
│  │ YAHTZEE           →   │   │
│  │ CHANCE            →   │   │
│  └──────────────────────┘   │
│                              │
│  OTHER PLAYERS:              │
│  ● ALEX - 95 pts             │ ← Other players (condensed)
│  ● JORDAN - 112 pts          │
│                              │
└─────────────────────────────┘
```

**Interactions:**
- Tap any available category (→) to open score entry modal
- Swipe or tap player name to advance to next player (after score entered)
- Tap "OTHER PLAYERS" to expand full leaderboard

---

#### Screen 3B: Game Board (Multi-Device)
**Layout:**
- Similar to single device, but shows only your scorecard
- Add persistent "SCORES" button to see all players
- Current turn indicator: "YOUR TURN" or "MAYA'S TURN" banner

**Interactions:**
- Can only enter scores when it's your turn
- Real-time updates when others enter scores
- Scores button opens overlay with all player standings

---

#### Screen 4: Score Entry Modal
**Layout:**
```
┌─────────────────────────────┐
│  THREES                      │ ← Category name (Instrument Serif)
│  Score all threes             │ ← Rule description (Albert Sans)
│                              │
│  ┌───────────────────┐      │
│  │                   │      │
│  │       45          │      │ ← Giant input (Instrument Serif, 80px)
│  │                   │      │
│  └───────────────────┘      │
│                              │
│  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐     │
│  │7│8│9│ │ │ │ │ │ │X│     │ ← Number pad
│  ├─┼─┼─┤ │ │ │ │ │ ├─┤     │
│  │4│5│6│ │ │ │ │ │ │←│     │
│  ├─┼─┼─┤ │ │ │ │ │ └─┘     │
│  │1│2│3│ │ │ │ │ │          │
│  ├─┴─┴─┤ │ │ │ │ │          │
│  │  0  │ │ │ │ │ │          │
│  └─────┘ │ │ │ │ │          │
│          │ │ │ │ │          │
│  ┌────────────────┐          │
│  │   CONFIRM      │          │
│  └────────────────┘          │
└─────────────────────────────┘
```

**Interactions:**
- Number pad input with backspace
- X button = "Zero out" (intentional 0)
- Confirm button validates score (e.g., max 15 for threes)
- Modal closes on confirm, auto-advances turn

---

#### Screen 5: Winner Screen
**Layout:**
- Full-screen gradient or animated background
- Giant "WINNER" text (Instrument Serif, 120px)
- Winner's name (Instrument Serif, 80px)
- Final score (Instrument Serif, 64px)
- Runner-up scores (condensed list)
- Confetti or celebration animation
- "PLAY AGAIN" button
- "VIEW SCORES" button

**Interactions:**
- Auto-show after round 13 completed
- Play Again → Reset game, keep players
- View Scores → Show detailed scorecard breakdown

---

### 7.2 Animation & Transitions

**Micro-interactions:**
- Button press: Scale down to 0.95 + darken 20%
- Score entry: Number appears with scale-in (0.8 → 1.0)
- Turn change: Slide transition (300ms ease-out)
- Error state: Shake animation (200ms)

**Page Transitions:**
- Crossfade between screens (400ms)
- Modal: Scale + fade in (300ms)

**Celebrations:**
- Yahtzee scored: Confetti burst + bounce animation
- Winner screen: Staggered entrance (names cascade in)
- Bonus achieved: Highlight pulse (63+ points)

### 7.3 Responsive Breakpoints

```css
/* Mobile-first approach */
- Mobile: 320px - 767px (default)
- Tablet: 768px - 1023px (2-column layout)
- Desktop: 1024px+ (3-column layout, larger type)
```

**Adaptations:**
- Mobile: Full-screen layouts, single column
- Tablet: Side-by-side scorecard + leaderboard
- Desktop: All players visible simultaneously, larger tap targets become click targets

---

## 8. Wireframes & Mockups

### 8.1 MVP Wireframe Structure

**Wireframe Deliverables Needed:**
1. Home screen (mode select)
2. Single device setup
3. Multi-device host setup
4. Multi-device join
5. Game board (single device view)
6. Game board (multi-device personal view)
7. Score entry modal
8. Leaderboard overlay
9. Winner screen
10. Mobile vs. Desktop responsive variations

**Tools Recommended:**
- Figma (preferred for design system)
- Sketch
- Adobe XD

### 8.2 Design System Components

**Component Library Needed:**
```
- Button (primary, secondary, disabled)
- Input field (text, number)
- Modal overlay
- Scorecard row (available, completed, active)
- Player badge (name + color indicator)
- Number pad
- Turn indicator
- Progress bar (upper section bonus)
- Code display (session joining)
- Alert/toast notifications
```

---

## 9. Success Metrics

### 9.1 MVP Success Criteria

**Functional Goals:**
- [ ] Single device mode works smoothly for 2-6 players
- [ ] Multi-device mode successfully syncs across devices
- [ ] Score calculations are always accurate
- [ ] App is installable as PWA on iOS and Android
- [ ] Works offline for single device mode
- [ ] Zero critical bugs in score tracking logic

**Design Goals:**
- [ ] Design system is cohesive and well-documented
- [ ] Bold aesthetic is consistent across all screens
- [ ] Animations feel snappy and intentional
- [ ] Typography hierarchy is clear and readable
- [ ] Color palette creates visual impact

**Technical Goals:**
- [ ] Clean, well-commented codebase
- [ ] Component library is reusable
- [ ] Real-time sync has <500ms latency
- [ ] Responsive across mobile, tablet, desktop
- [ ] Lighthouse score: 90+ on performance, accessibility
- [ ] Easy for others to fork and modify

**Learning Goals:**
- [ ] Understand real-time database (Firebase/Supabase)
- [ ] Build a complete design system from scratch
- [ ] Practice React component architecture
- [ ] Explore PWA capabilities
- [ ] Get comfortable with WebSockets/real-time data

**Community Goals:**
- [ ] Clear README with setup instructions
- [ ] Contributing guidelines for other developers
- [ ] MIT or similar permissive license
- [ ] Deployed and publicly accessible
- [ ] 5+ friends/testers actually use it at game night

### 9.2 Feedback Collection

**MVP Testing:**
- [ ] 5-10 playtesting sessions with friends
- [ ] GitHub issues for bug reports
- [ ] Optional in-app feedback link
- [ ] Observe people using it in real game situations
- [ ] Iterate based on what confuses people

---

## 10. Development Roadmap

### Phase 1: MVP (~6 weeks, flexible timeline)

**This is a side project—life happens! Adjust timeline as needed.**

**Week 1-2: Setup & Core Infrastructure**
- [ ] Create GitHub repo with MIT license
- [ ] Initialize React project (Vite or CRA)
- [ ] Set up Tailwind CSS + custom design tokens
- [ ] Load Google Fonts (Instrument Serif, Albert Sans)
- [ ] Create basic component library (Button, Input, Card)
- [ ] Set up Firebase or Supabase account
- [ ] Deploy "hello world" to Vercel/Netlify

**Week 3-4: Single Device Mode**
- [ ] Home screen + mode select UI
- [ ] Player setup flow (2-6 names)
- [ ] Game board layout (mobile-first)
- [ ] Scorecard component with all 13 categories
- [ ] Score entry modal with number pad
- [ ] Score calculation logic (upper bonus, totals)
- [ ] Local state management (React Context/Zustand)
- [ ] Basic animations (button press, transitions)

**Week 5: Multi-Device Mode**
- [ ] Session creation (generate 6-char code)
- [ ] Join session flow
- [ ] Firebase/Supabase real-time setup
- [ ] Sync scores across devices
- [ ] Connection status indicator
- [ ] Player list in lobby

**Week 6: Polish & Testing**
- [ ] Winner announcement screen
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] PWA setup (manifest, service worker)
- [ ] Bug fixes from playtesting
- [ ] README with screenshots
- [ ] Deploy final version
- [ ] Share with friends!

**Reality Check:**
- First MVP might take 8-10 weeks if this is your first React project
- That's totally fine! Pace yourself.
- Focus on getting single device mode working first
- Multi-device can wait if you need to ship something

### Phase 2: Enhancements (When You Feel Like It)

**No rush on these—ship MVP first, then add if inspired:**

**Illustrations Sprint (1-2 weeks):**
- [ ] Hand-draw or vector 13 category illustrations
- [ ] Add dice graphics
- [ ] Animated dice for Yahtzee celebration
- [ ] Decorative elements

**Polish Sprint (1-2 weeks):**
- [ ] Undo last entry
- [ ] QR code for joining sessions
- [ ] Game history (if adding storage)
- [ ] Sound effects (optional, keep subtle)
- [ ] More celebration animations
- [ ] Dark mode (optional)

**Future Ideas (No Timeline):**
- Multiple game types (Triple Yahtzee, etc.)
- House rules toggles
- Localization (other languages)
- Accessibility improvements
- Mobile app wrapper (Capacitor/React Native)

---

## 11. Open Questions & Decisions Needed

### Keeping It Simple (Open Source Philosophy):

**Things to AVOID in MVP:**
- ❌ User accounts/authentication (unnecessary complexity)
- ❌ Analytics tracking (privacy-first approach)
- ❌ Social features (save for Phase 2+ if needed)
- ❌ Monetization hooks (stays 100% free)
- ❌ Multiple game variants (focus on classic Yahtzee)

**MVP Scope Boundaries:**
- ✅ Just score tracking (no dice rolling simulation)
- ✅ Classic Yahtzee rules only
- ✅ Simple session codes (no complex matchmaking)
- ✅ Basic animations (fancy stuff in Phase 2)
- ✅ Core 2 modes: single device + multi-device

### Design Decisions:
- [ ] Should colors rotate per player or per screen?
- [ ] Should we show all players' scorecards simultaneously (desktop)?
- [ ] How much animation is too much? (balance fun vs. distraction)
- [ ] Should we include dice rolling functionality? (Out of scope for MVP)

### Technical Decisions:
- [ ] Firebase vs. Supabase for backend?
- [ ] Should single-device mode work offline?
- [ ] Session expiration time (2 hours? 24 hours?)
- [ ] Max players per session (6? 8?)

### Scope Decisions:
- [ ] Include Joker rules toggle? (Advanced Yahtzee variant)
- [ ] Support multiple game types? (Triple Yahtzee, etc.)
- [ ] Include score recommendations based on dice? (Helper mode)

---

## 12. Getting Started

### Absolute First Steps

**1. Set Up Your Workspace (Day 1)**
- [ ] Create a GitHub account (if you don't have one)
- [ ] Install VS Code or your preferred editor
- [ ] Install Node.js (v18 or later)
- [ ] Create a new repository: "yahtzee-tracker" or similar
- [ ] Add MIT license and basic README

**2. Design Before Code (Days 2-3)**
- [ ] Create a Figma account (free)
- [ ] Sketch wireframes for the 5 core screens:
  - Home (mode select)
  - Setup (player names)
  - Game board
  - Score entry modal
  - Winner screen
- [ ] Pick your 5 primary colors from the palette
- [ ] Test them together to see what feels right

**3. Create Your Foundation (Days 4-5)**
```bash
# Set up React project
npm create vite@latest yahtzee-tracker -- --template react
cd yahtzee-tracker
npm install

# Add Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Add fonts to index.html
# (copy from the design guidelines doc)

# Start dev server
npm run dev
```

**4. Build One Thing at a Time**
- Week 1: Just get the home screen looking good
- Week 2: Add the setup flow (player names)
- Week 3: Build the scorecard (read-only at first)
- Week 4: Add score entry modal
- Week 5: Hook it all up with state management
- Week 6: Add multi-device (if feeling ambitious)

**5. Ship Something Small**
Deploy even if it's not perfect! Use Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (in project directory)
vercel

# Follow prompts, get live URL in seconds
```

### Learning Resources

**React Basics:**
- Official tutorial: https://react.dev/learn
- Scrimba React course (free): https://scrimba.com/learn/learnreact

**Tailwind CSS:**
- Official docs: https://tailwindcss.com/docs
- Tailwind UI components for inspiration: https://tailwindui.com/components

**Real-time Database:**
- Firebase tutorial: https://firebase.google.com/docs/database/web/start
- Supabase quickstart: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs

**Design Inspiration:**
- CMYK Games: https://www.cmyk.games
- Swiss Style posters: Search Pinterest/Behance
- Brutalist websites: https://brutalistwebsites.com

### Questions to Answer Before You Start

1. **Which database?** Firebase (easier) or Supabase (more learning)?
2. **Domain name?** Use free subdomain or buy one?
3. **How much time per week?** Set realistic expectations
4. **Who's your first tester?** Find a friend who plays Yahtzee
5. **What's your "done" criteria?** When can you celebrate v1.0?

**Remember:** Start simple. You can always add more later!

---

## 13. Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Project takes longer than 6 weeks | Low | High | It's a side project—no deadline pressure. Ship MVP when ready. |
| Real-time sync unreliable on free tier | Medium | Low | Firebase/Supabase free tiers are robust. Local storage fallback for single device. |
| Design is too bold/polarizing | Low | Medium | It's art! Some will love it, some won't. Stay true to the vision. |
| Lose motivation mid-project | Medium | Medium | Set small milestones, share progress publicly, keep it fun. |
| Session joining too complicated | High | Medium | Add clear instructions, QR code in Phase 2, test with non-technical friends. |
| Free tier limits exceeded | Low | Low | Unlikely for personal project. If it happens, consider it success! |
| Code becomes unmaintainable | Medium | Medium | Document as you go, keep components small, write clear commit messages. |

---

## 14. Appendix

### A. Yahtzee Scoring Reference

**Upper Section:**
- Ones: Sum of all dice showing 1
- Twos: Sum of all dice showing 2
- Threes: Sum of all dice showing 3
- Fours: Sum of all dice showing 4
- Fives: Sum of all dice showing 5
- Sixes: Sum of all dice showing 6
- **Bonus:** +35 points if upper section totals ≥63

**Lower Section:**
- 3-of-a-Kind: Sum of all dice (need 3+ matching)
- 4-of-a-Kind: Sum of all dice (need 4+ matching)
- Full House: 25 points (3 of one, 2 of another)
- Small Straight: 30 points (4 consecutive numbers)
- Large Straight: 40 points (5 consecutive numbers)
- Yahtzee: 50 points (all 5 dice match)
- Chance: Sum of all dice (no restriction)

**Game:** 13 rounds total (1 per category), highest score wins

### B. CMYK Games Style References

**Key Design Elements to Emulate:**
1. **Bold Typography:** Large, confident type that dominates the screen
2. **High Contrast:** Always white on bright colors, never subtle
3. **Geometric Simplicity:** Rectangles, circles, clean borders—no gradients
4. **Saturated Colors:** Think screen colors, not print colors—vibrant and digital
5. **Intentional Whitespace:** Let bold elements breathe
6. **Playful Details:** Small moments of delight (animations, easter eggs)
7. **Swiss Poster Influence:** Grid-based, asymmetric balance, typographic hierarchy

**Color Palette Inspiration:**
- CMYK's "Wavelength": Bold concentric circles, pink/purple/blue gradient
- Think 1970s screenprinting, Swiss International Style posters
- Avoid pastels, muted tones, or "soft" aesthetics

### C. Open Source Considerations

**License:**
- **Recommended:** MIT License (most permissive, encourages adoption)
- **Alternative:** Apache 2.0 (includes patent protection)
- **Why:** Allow anyone to use, modify, and learn from the code

**Repository Structure:**
```
/yahtzee-tracker
  /src
  /public
  /docs
    - CONTRIBUTING.md
    - CODE_OF_CONDUCT.md
    - design-system.md
  README.md
  LICENSE
  package.json
```

**README Must Include:**
- Project description and screenshot
- Live demo link
- Quick start guide (installation, running locally)
- Tech stack overview
- Design philosophy (link to style guide)
- How to contribute
- License information
- Credits (CMYK Games inspiration, fonts, libraries)

**Contributing Guidelines:**
- Code formatting standards (Prettier, ESLint)
- How to submit issues and PRs
- Design contribution process (Figma access?)
- Communication channels (GitHub Discussions?)

**Deployment Strategy:**
- Host on free tier: Vercel, Netlify, or GitHub Pages
- Database: Firebase free tier or Supabase free tier
- Domain: Free subdomain or simple domain ($10-15/year)
- CI/CD: GitHub Actions for automated deployment

**Attribution:**
- Credit CMYK Games for design inspiration
- Credit Instrument Serif and Albert Sans (Google Fonts)
- Credit any libraries used (React, Firebase, etc.)
- Link to original Yahtzee rules

**Community Building (Optional):**
- GitHub Discussions for questions
- Twitter/Bluesky account for updates
- Blog post about the design process
- Submit to design/dev showcases (Hacker News Show HN, /r/webdev)

### D. Privacy & Data

**No Tracking:**
- No analytics (or privacy-focused only: Plausible, Fathom)
- No cookies
- No user accounts required
- No data collection

**Session Data:**
- Stored temporarily in database for multi-device
- Auto-delete after 24 hours of inactivity
- Never tied to user identity
- Players choose their own names (no email/login)

**Local Storage:**
- Single device games stored locally only
- Never sent to server
- User can clear anytime

### D. Technical Resources

**Typography:**
- Instrument Serif: https://fonts.google.com/specimen/Instrument+Serif
- Albert Sans: https://fonts.google.com/specimen/Albert+Sans

**Real-time Options:**
- Firebase Realtime Database: https://firebase.google.com/docs/database
- Supabase Realtime: https://supabase.com/docs/guides/realtime

**PWA Guide:**
- https://web.dev/progressive-web-apps/

---

## Document Control

**Project Lead:** [Your Name]

**Contributors Welcome:**
- Developers (React, Firebase/Supabase)
- Designers (illustrations, animations)
- Testers (play Yahtzee with the app!)
- Writers (documentation, tutorials)

**Version History:**
- v1.0 (Jan 19, 2026): Initial PRD draft
- v1.1 (Jan 19, 2026): Updated for open source focus

**Repository:**
- GitHub: [Will be created]
- License: MIT (or your preference)

---

**Next Steps:**
1. Set up GitHub repository with README
2. Create Figma design file (or use Figma Community for public access)
3. Initialize React project with design system
4. Build MVP features (6 week sprint)
5. Deploy to free hosting
6. Share with friends and iterate
7. Write blog post about the design process (optional)
8. Submit to design showcases (optional)
