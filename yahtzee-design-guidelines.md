# CMYK Games Style Guide
## Yahtzee Score Tracker Design System

---

## 1. Color System

### 1.1 Primary Color Palette

```
Electric Blue    #0066FF    RGB(0, 102, 255)    CMYK(100, 60, 0, 0)
Hot Magenta      #FF0099    RGB(255, 0, 153)    CMYK(0, 100, 40, 0)
Bright Yellow    #FFDD00    RGB(255, 221, 0)    CMYK(0, 13, 100, 0)
Vivid Orange     #FF6600    RGB(255, 102, 0)    CMYK(0, 60, 100, 0)
Deep Purple      #6600CC    RGB(102, 0, 204)    CMYK(50, 100, 0, 20)
```

### 1.2 Supporting Colors

```
White            #FFFFFF    RGB(255, 255, 255)
Black            #000000    RGB(0, 0, 0)
Bright Green     #00FF66    RGB(0, 255, 102)    [Active/Success state]
Bright Red       #FF0033    RGB(255, 0, 51)     [Error state]
```

### 1.3 Color Usage Rules

**Backgrounds:**
- Rotate primary colors for different screens
- Use solid colors only—no gradients in MVP
- Each major screen should have a different color
- Example rotation: Home (Blue) → Setup (Magenta) → Game (Yellow) → Winner (Orange)

**Text:**
- Always white (#FFFFFF) on colored backgrounds
- Always black (#000000) on white backgrounds
- NEVER use colored text on colored backgrounds

**Borders & Dividers:**
- Use black (#000000) at 4-8px thickness
- Alternative: White (#FFFFFF) at 2-4px for subtle separation

**Interactive States:**
```css
Default:     background-color: primary-color; opacity: 1;
Hover:       background-color: primary-color; opacity: 0.9;
Active:      background-color: #000000; color: #FFFFFF;
Disabled:    background-color: primary-color; opacity: 0.4;
Selected:    background-color: #00FF66; color: #000000;
Error:       background-color: #FF0033; color: #FFFFFF;
```

### 1.4 Player Color Assignments

Assign in this order for visual diversity:
```
Player 1: Hot Magenta (#FF0099)
Player 2: Electric Blue (#0066FF)
Player 3: Vivid Orange (#FF6600)
Player 4: Bright Green (#00FF66)
Player 5: Deep Purple (#6600CC)
Player 6: Bright Yellow (#FFDD00)
```

---

## 2. Typography System

### 2.1 Typeface Specifications

**Instrument Serif**
- Weights: Regular (400), SemiBold (600), Bold (700)
- Use for: Headlines, player names, scores, numbers, category labels
- Character: Editorial, sophisticated, makes a statement
- Load from Google Fonts:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400;600;700&display=swap" rel="stylesheet">
  ```

**Albert Sans**
- Weights: Regular (400), Medium (500), Bold (700)
- Use for: UI labels, buttons, body text, descriptions
- Character: Clean, geometric, highly legible
- Load from Google Fonts:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  ```

### 2.2 Type Scale

```css
/* Instrument Serif (Display) */
--type-display-1: 120px / 1.0 / 700    /* Winner announcement */
--type-display-2: 96px / 1.0 / 700     /* Main title (YAHTZEE) */
--type-display-3: 80px / 1.0 / 600     /* Score entry numbers */
--type-display-4: 64px / 1.1 / 700     /* Section headers */
--type-display-5: 48px / 1.2 / 600     /* Player names */
--type-display-6: 32px / 1.2 / 400     /* Category labels */

/* Albert Sans (UI) */
--type-ui-1: 24px / 1.3 / 700          /* Large buttons */
--type-ui-2: 18px / 1.4 / 500          /* Body text, descriptions */
--type-ui-3: 16px / 1.4 / 400          /* Standard UI labels */
--type-ui-4: 14px / 1.4 / 500          /* Small labels, metadata */
--type-ui-5: 12px / 1.3 / 400          /* Captions, helper text */
```

### 2.3 Typographic Hierarchy Examples

**Screen Header:**
```
ROUND 3 / 13          [Albert Sans, 14px, Medium, Uppercase]
```

**Player Turn Indicator:**
```
★ MAYA                [Instrument Serif, 48px, SemiBold]
128 pts               [Albert Sans, 24px, Bold]
```

**Category Row:**
```
THREES           →    [Instrument Serif, 32px, Regular]
```

**Button:**
```
START GAME            [Albert Sans, 24px, Bold, Uppercase]
```

### 2.4 Typography Best Practices

**DO:**
- Use all caps for emphasis (buttons, labels, headers)
- Use generous letter-spacing (0.05-0.1em) for all-caps text
- Keep line-height tight for display text (1.0-1.2)
- Align to grid (use 8px baseline grid)
- Make numbers BIG—they're the hero content

**DON'T:**
- Mix serif and sans in the same text block
- Use italics (not part of CMYK aesthetic)
- Use font weights below 400 (Regular)
- Set text smaller than 14px
- Use tight tracking (<-0.02em)

---

## 3. Layout & Grid System

### 3.1 Grid Fundamentals

**8-Point Grid:**
- All spacing uses multiples of 8: 8px, 16px, 24px, 32px, 40px, 48px, etc.
- Margins: 16px (mobile), 32px (tablet), 48px (desktop)
- Gutters: 16px between columns
- Component padding: 16px minimum, 24px preferred

**Column System:**
- Mobile: 1 column (full width)
- Tablet: 2 columns (scorecard + sidebar)
- Desktop: 3-4 columns (multiple players visible)

### 3.2 Component Dimensions

**Buttons:**
```
Small:     min-width: 120px, height: 48px, padding: 12px 24px
Medium:    min-width: 160px, height: 64px, padding: 16px 32px
Large:     min-width: 240px, height: 80px, padding: 24px 48px
Full:      width: 100%, height: 64-80px
```

**Input Fields:**
```
Height: 64px
Padding: 16px
Border: 4px solid white
Font size: 24px (Albert Sans)
```

**Modal:**
```
Mobile:    90vw width, max-height: 80vh
Tablet:    600px width, auto height
Desktop:   700px width, auto height
Padding:   32px all sides
```

**Scorecard Row:**
```
Height: 56px
Padding: 12px 16px
Border-bottom: 2px solid black (or white)
```

### 3.3 Layout Patterns

**Full-Screen Centered (Home Screen):**
```
┌─────────────────────────────┐
│                              │
│                              │
│         YAHTZEE              │ ← 96px Instrument Serif
│                              │
│    ┌──────────────────┐     │
│    │  SINGLE DEVICE   │     │ ← 64px height button
│    └──────────────────┘     │
│                              │
│    ┌──────────────────┐     │
│    │  MULTI DEVICE    │     │
│    └──────────────────┘     │
│                              │
│                              │
└─────────────────────────────┘
```

**Split Screen (Game Board - Desktop):**
```
┌───────────────┬───────────────┐
│               │               │
│   SCORECARD   │  LEADERBOARD  │
│   (Primary)   │  (Secondary)  │
│               │               │
│               │               │
└───────────────┴───────────────┘
```

**Swiss Poster Style (Asymmetric):**
```
┌─────────────────────────────┐
│ ROUND 3                      │ ← Small, top-left
│                              │
│                              │
│           ★ MAYA             │ ← Large, off-center
│           128 pts            │
│                              │
│  ┌──────────────────────┐   │
│  │     [SCORECARD]      │   │ ← Aligned to grid
│  └──────────────────────┘   │
└─────────────────────────────┘
```

---

## 4. Component Design Patterns

### 4.1 Buttons

**Primary Button:**
```css
background: #000000;
color: #FFFFFF;
border: none;
border-radius: 0px;  /* Square corners */
padding: 16px 32px;
font: Albert Sans, 24px, Bold;
text-transform: uppercase;
letter-spacing: 0.08em;
box-shadow: 0px 8px 0px rgba(0,0,0,0.3);  /* Pressed effect */
transition: transform 0.1s, box-shadow 0.1s;

&:active {
  transform: translateY(4px);
  box-shadow: 0px 4px 0px rgba(0,0,0,0.3);
}
```

**Secondary Button (Ghost):**
```css
background: transparent;
color: #FFFFFF;
border: 4px solid #FFFFFF;
/* Same other properties as primary */
```

### 4.2 Scorecard Row

**Available Category:**
```css
background: rgba(255, 255, 255, 0.1);
color: #FFFFFF;
border-bottom: 2px solid rgba(255, 255, 255, 0.3);
cursor: pointer;

/* Right arrow indicator */
&:after {
  content: '→';
  font-size: 32px;
  float: right;
}

&:hover {
  background: rgba(255, 255, 255, 0.2);
}
```

**Completed Category:**
```css
background: rgba(0, 0, 0, 0.2);
color: #FFFFFF;
opacity: 0.6;
cursor: not-allowed;

/* Checkmark + score */
&:before {
  content: '✓';
  margin-right: 8px;
}
```

**Active/Selected Category:**
```css
background: #00FF66;
color: #000000;
border: 4px solid #000000;
/* Bold emphasis */
```

### 4.3 Number Pad

```css
/* Grid Layout: 3 columns x 4 rows */
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 8px;

/* Individual buttons */
.number-key {
  aspect-ratio: 1 / 1;  /* Square */
  min-height: 64px;
  background: rgba(0, 0, 0, 0.2);
  color: #FFFFFF;
  border: 2px solid #FFFFFF;
  font: Instrument Serif, 32px, Bold;
}

/* Zero key spans 2 columns */
.number-key[data-value="0"] {
  grid-column: span 2;
}

/* Backspace key */
.number-key[data-action="backspace"] {
  background: #FF0033;
  content: '←';
}
```

### 4.4 Player Badge

```css
.player-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  
  /* Color indicator dot */
  &:before {
    content: '';
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--player-color);
    border: 2px solid #FFFFFF;
  }
  
  /* Player name */
  font: Albert Sans, 18px, Bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Active turn indicator */
.player-badge.active {
  &:before {
    width: 24px;
    height: 24px;
    border: 4px solid #FFFFFF;
    box-shadow: 0 0 0 2px #000000;
  }
}
```

### 4.5 Modal Overlay

```css
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);  /* Dark scrim */
  backdrop-filter: blur(8px);
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 700px;
  margin: 10vh auto;
  background: var(--primary-color);  /* Matches screen color */
  border: 8px solid #000000;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.4);
  padding: 32px;
}
```

### 4.6 Progress Bar (Upper Section Bonus)

```css
.bonus-progress {
  display: flex;
  align-items: center;
  gap: 16px;
  
  /* Label */
  .label {
    font: Albert Sans, 16px, Bold;
    text-transform: uppercase;
  }
  
  /* Bar container */
  .bar {
    flex: 1;
    height: 16px;
    background: rgba(0, 0, 0, 0.2);
    border: 2px solid #FFFFFF;
    position: relative;
  }
  
  /* Fill */
  .fill {
    height: 100%;
    background: #00FF66;
    transition: width 0.3s ease-out;
  }
  
  /* Score text (12/63) */
  .score {
    font: Instrument Serif, 24px, Bold;
    min-width: 80px;
    text-align: right;
  }
}
```

---

## 5. Animation & Motion

### 5.1 Animation Principles

**CMYK Style Motion:**
- Snappy, not floaty (prefer 200-400ms)
- Use ease-out for entrances
- Use ease-in for exits
- Minimal easing curves (no complex beziers)
- Intentional, not decorative

### 5.2 Transition Timings

```css
/* Micro-interactions */
--timing-instant:    0ms        /* Immediate feedback */
--timing-fast:       150ms      /* Button press */
--timing-base:       300ms      /* Standard transitions */
--timing-slow:       500ms      /* Page transitions */
--timing-slower:     800ms      /* Celebration animations */

/* Easing curves */
--ease-out:    cubic-bezier(0.0, 0.0, 0.2, 1)
--ease-in:     cubic-bezier(0.4, 0.0, 1, 1)
--ease-inout:  cubic-bezier(0.4, 0.0, 0.2, 1)
```

### 5.3 Animation Recipes

**Button Press:**
```css
button {
  transform: scale(1);
  transition: transform 150ms ease-out;
}

button:active {
  transform: scale(0.95);
}
```

**Score Entry (Number Appears):**
```css
@keyframes scoreAppear {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.score-number {
  animation: scoreAppear 300ms ease-out;
}
```

**Turn Change (Slide):**
```css
@keyframes slideIn {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.player-card.entering {
  animation: slideIn 400ms ease-out;
}
```

**Error Shake:**
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.error {
  animation: shake 200ms ease-inout;
}
```

**Winner Celebration (Confetti):**
```javascript
// Use canvas-confetti library
confetti({
  particleCount: 200,
  spread: 180,
  origin: { y: 0.4 },
  colors: ['#0066FF', '#FF0099', '#FFDD00', '#FF6600', '#6600CC']
});
```

**Bonus Achieved (Pulse):**
```css
@keyframes bonusPulse {
  0%, 100% {
    transform: scale(1);
    background: #00FF66;
  }
  50% {
    transform: scale(1.05);
    background: #00FF99;
    box-shadow: 0 0 32px rgba(0, 255, 102, 0.5);
  }
}

.bonus-achieved {
  animation: bonusPulse 800ms ease-inout 2;
}
```

---

## 6. Illustrations & Graphics

### 6.1 Illustration Style Guidelines

**Characteristics:**
- Bold, thick outlines (4-8px stroke)
- Flat colors, no gradients or shading
- Geometric shapes, minimal details
- Playful but not childish
- High contrast

**Inspiration References:**
- 1960s-70s screenprint posters
- Push Pin Studios (historical reference)
- Saul Bass title sequences
- Modern flat illustration (Malika Favre, Olimpia Zagnoli)

### 6.2 Icon Design

**Style Rules:**
```
Stroke weight: 4px
Corner radius: 0px (sharp corners preferred)
Fill: Solid colors only
Alignment: Pixel-perfect to 8px grid
Size: 32px, 48px, 64px (multiples of 16)
```

**Example Icons Needed:**
- Dice (1-6 dots)
- Checkmark (completed)
- Arrow (available, turn indicator)
- Star (current player)
- Plus (add player)
- X (close, delete)
- Refresh (play again)
- Info (rules)
- Settings (gear)

### 6.3 Category Illustrations (Phase 2)

Each Yahtzee category should have a unique illustration:

**Upper Section (Dice Numbers):**
- ONES: Single large die showing 1
- TWOS: Two dice showing 2
- THREES: Three dice showing 3
- FOURS: Four dice arranged in square
- FIVES: Five dice in X pattern
- SIXES: Six dice in two rows

**Lower Section (Combinations):**
- 3-OF-A-KIND: Three matching dice overlapping
- 4-OF-A-KIND: Four dice in a cluster
- FULL HOUSE: House shape made of dice
- SMALL STRAIGHT: Four dice in ascending staircase
- LARGE STRAIGHT: Five dice in ascending line
- YAHTZEE: Five matching dice with radiating lines (impact!)
- CHANCE: Dice scattered/tumbling

**Illustration Specs:**
```
Canvas: 200px x 200px
Stroke: 6px, black
Fill: Primary palette colors
Background: Transparent
Format: SVG (scalable)
Style: Flat, bold, geometric
```

---

## 7. Responsive Design Strategy

### 7.1 Mobile-First Approach

**Mobile (320px - 767px):**
- Single column layout
- Full-screen views
- Tap targets minimum 48px x 48px
- Larger text for readability
- Simplified navigation

**Tablet (768px - 1023px):**
- Two-column layout where appropriate
- Side-by-side scorecard + leaderboard
- Slightly smaller type (still bold)
- Maintain tap targets at 44px minimum

**Desktop (1024px+):**
- Multi-column layouts (3-4 players visible)
- Larger tap targets become click targets (40px min)
- Utilize horizontal space for simultaneous views
- Keyboard shortcuts (number keys for score entry)

### 7.2 Breakpoint-Specific Adjustments

**Mobile:**
```css
.page-title { font-size: 64px; }
.player-name { font-size: 36px; }
.category-label { font-size: 24px; }
.button { height: 64px; }
```

**Tablet:**
```css
.page-title { font-size: 80px; }
.player-name { font-size: 42px; }
.category-label { font-size: 28px; }
.button { height: 72px; }
```

**Desktop:**
```css
.page-title { font-size: 96px; }
.player-name { font-size: 48px; }
.category-label { font-size: 32px; }
.button { height: 80px; }
```

### 7.3 Touch vs. Mouse Interactions

**Touch (Mobile/Tablet):**
- Larger tap targets (min 48px)
- No hover states (use active states instead)
- Swipe gestures for navigation
- Long-press for contextual actions

**Mouse (Desktop):**
- Hover states for feedback
- Click interactions
- Keyboard shortcuts
- Right-click context menus (optional)

---

## 8. Accessibility Considerations

### 8.1 Color Contrast

**WCAG AA Compliance:**
- White text on primary colors: All pass (ratio >7:1)
- Black text on white: AAA compliant
- Green/Red states: Test for colorblind users

**Colorblind-Friendly Palette (Phase 2):**
```
Deuteranopia-safe colors:
- Blue (#0066FF) → OK
- Magenta (#FF0099) → Adjust to #FF006F
- Yellow (#FFDD00) → OK
- Orange (#FF6600) → OK
- Purple (#6600CC) → OK
```

### 8.2 Typography Accessibility

- Minimum 14px for body text
- Maximum line length: 65 characters
- Line height: 1.4-1.5 for readability
- No italics (harder to read)
- No all-caps for body text (only labels)

### 8.3 Keyboard Navigation

**Tab Order:**
1. Mode select buttons
2. Player name inputs
3. Start game button
4. Scorecard categories (top to bottom)
5. Score entry number pad
6. Confirm button

**Keyboard Shortcuts (Desktop):**
```
1-9, 0:    Score entry (number pad)
Enter:     Confirm score
Escape:    Close modal
Tab:       Navigate forward
Shift+Tab: Navigate backward
Space:     Select button
```

### 8.4 Screen Reader Support

**ARIA Labels:**
```html
<button aria-label="Select single device mode">SINGLE DEVICE</button>
<input aria-label="Player 1 name" type="text" />
<div role="button" aria-label="Enter score for threes" tabindex="0">THREES →</div>
<div aria-live="polite" aria-atomic="true">Current turn: Maya</div>
```

**Semantic HTML:**
- Use `<button>` for buttons, not `<div>`
- Use `<input>` for text entry
- Use `<main>`, `<header>`, `<nav>` for structure
- Use `<h1>-<h6>` for headings

---

## 9. Implementation Examples

### 9.1 HTML/CSS Component: Primary Button

```html
<button class="btn-primary">START GAME</button>
```

```css
.btn-primary {
  /* Layout */
  display: inline-block;
  min-width: 240px;
  height: 80px;
  padding: 24px 48px;
  
  /* Typography */
  font-family: 'Albert Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #FFFFFF;
  
  /* Appearance */
  background-color: #000000;
  border: none;
  border-radius: 0;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3);
  
  /* Behavior */
  cursor: pointer;
  transition: transform 150ms ease-out, box-shadow 150ms ease-out;
  
  /* States */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 0 rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(4px);
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3);
  }
}

/* Responsive */
@media (max-width: 767px) {
  .btn-primary {
    width: 100%;
    height: 64px;
    font-size: 20px;
  }
}
```

### 9.2 React Component: Scorecard Row

```jsx
import React from 'react';
import './ScoreRow.css';

const ScoreRow = ({ 
  category, 
  score, 
  isAvailable, 
  isActive, 
  onClick 
}) => {
  const getClassName = () => {
    if (isActive) return 'score-row score-row--active';
    if (score !== null) return 'score-row score-row--completed';
    if (isAvailable) return 'score-row score-row--available';
    return 'score-row';
  };

  return (
    <div 
      className={getClassName()}
      onClick={isAvailable ? onClick : undefined}
      role={isAvailable ? "button" : undefined}
      tabIndex={isAvailable ? 0 : -1}
      aria-label={`${category.name}. ${
        score !== null ? `Score: ${score}` : 'Available'
      }`}
    >
      <span className="score-row__label">
        {category.name}
      </span>
      
      {score !== null ? (
        <span className="score-row__score">
          ✓ {score}
        </span>
      ) : isAvailable ? (
        <span className="score-row__indicator">
          →
        </span>
      ) : null}
    </div>
  );
};

export default ScoreRow;
```

```css
/* ScoreRow.css */
.score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 12px 16px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  transition: background-color 200ms ease-out;
}

.score-row__label {
  font-family: 'Instrument Serif', serif;
  font-size: 28px;
  font-weight: 400;
  color: #FFFFFF;
  text-transform: uppercase;
}

.score-row__score {
  font-family: 'Instrument Serif', serif;
  font-size: 28px;
  font-weight: 600;
  color: #FFFFFF;
}

.score-row__indicator {
  font-size: 32px;
  color: #FFFFFF;
}

/* Available state */
.score-row--available {
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.score-row--available:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Completed state */
.score-row--completed {
  background: rgba(0, 0, 0, 0.2);
  opacity: 0.6;
}

/* Active/Selected state */
.score-row--active {
  background: #00FF66;
  border: 4px solid #000000;
  margin: -2px;  /* Compensate for border */
}

.score-row--active .score-row__label,
.score-row--active .score-row__score {
  color: #000000;
}

/* Responsive */
@media (max-width: 767px) {
  .score-row {
    height: 48px;
    padding: 10px 12px;
  }
  
  .score-row__label {
    font-size: 24px;
  }
  
  .score-row__score {
    font-size: 24px;
  }
}
```

### 9.3 CSS Animation: Turn Change

```css
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.player-card {
  /* Position for animation */
  position: relative;
}

.player-card.entering {
  animation: slideInRight 400ms ease-out;
}

.player-card.exiting {
  animation: slideOutLeft 400ms ease-in;
}
```

---

## 10. Design Checklist

### Pre-Development
- [ ] Finalize primary color palette
- [ ] Load custom fonts (Instrument Serif, Albert Sans)
- [ ] Create component library in Figma
- [ ] Design all key screens (10 screens minimum)
- [ ] Test color contrast for WCAG AA
- [ ] Get stakeholder approval on aesthetic

### MVP Development
- [ ] Implement design system (colors, typography, spacing)
- [ ] Build reusable components (buttons, inputs, cards)
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Implement animations (button press, transitions)
- [ ] Add keyboard navigation
- [ ] Test with real users (5-10 people)

### Post-MVP
- [ ] Create category illustrations (13 total)
- [ ] Add celebration animations (confetti, pulses)
- [ ] Implement advanced transitions
- [ ] Add Easter eggs/delightful moments
- [ ] Create marketing assets (screenshots, video)
- [ ] User test for accessibility

---

## 11. Resources & Tools

### Design Tools
- **Figma:** https://figma.com (recommended)
- **Adobe Illustrator:** For vector illustrations
- **Coolors:** https://coolors.co (color palette testing)
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/

### Development Tools
- **Google Fonts:** For Instrument Serif & Albert Sans
- **Tailwind CSS:** Utility-first CSS framework
- **Canvas Confetti:** https://github.com/catdad/canvas-confetti
- **Framer Motion:** For advanced React animations

### Inspiration
- **Swiss Poster Archive:** https://graphicdesign.stackexchange.com/questions/tagged/swiss-style
- **Saul Bass Posters:** https://www.artofthetitle.com/designer/saul-bass/
- **CMYK Games Portfolio:** https://www.cmyk.games/collections/games

---

## Final Notes

**Remember:**
1. **Bold is beautiful:** Don't be afraid of large type and bright colors
2. **Less is more:** Strip away unnecessary UI elements
3. **Function follows form:** Good design enhances usability
4. **Consistency matters:** Stick to the system once established
5. **Test with users:** Beautiful design means nothing if it's confusing

**When in doubt:**
- Make it BIGGER
- Make it BOLDER
- Make it SIMPLER

Good luck! 🎲
