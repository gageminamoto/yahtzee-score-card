# Agent Guidelines

## Styling & Theming

Every screen sits on a bold colour (page colour or player colour), and text must
be black or white depending on that colour. This is handled by two Tailwind
colour tokens that are scoped per surface with CSS variables:

- `fg` - black or white, whichever reads best on the current surface
- `surface` - the surface colour itself (use for text on a solid `bg-fg` fill)

**Never** pick colours with `dark:` variants, `textColor` props, inline
`style={{ color }}`, or `textColor === '#000000' ? ... : ...` ternaries.

### Setting up a surface

```jsx
import { usePageSurface, useSurface } from '../hooks/useSurface';

// A page: themed background for a colour-rotation index (handles dark mode
// and syncs the overscroll colour)
const { style } = usePageSurface(colorIndex);
<div className="min-h-dvh p-8 text-fg" style={style}>...</div>

// Any other coloured area (player panel, modal, chip)
const surface = useSurface();
<div style={surface(player.color).style}>...</div>
```

Dark mode darkens surface colours; `fg` follows automatically.

### Tokens

```jsx
// Text
className="text-fg"         // primary
className="text-fg/70"      // secondary / descriptions
// Fills - three levels only
className="bg-fg/10"        // subtle (cards, inputs, panels)
className="bg-fg/20"        // default (hover, selected, primary buttons)
className="bg-fg/30"        // strong
className="bg-fg text-surface"  // solid / active
// Borders
className="border-2 border-fg/40"  // default, `border-fg` when focused/selected
className="border-fg/20"           // dividers
```

- Corners are square. Use `rounded-full` only for pills, toggles, dots and avatars.
- Type: `font-serif` for titles/numbers, `font-sans` for UI. Use the scale
  `text-ui`, `text-body`, `text-body-lg`, `text-subtitle`, `text-title`,
  `text-headline`, `text-display` (they respect the font-size setting).
- Use Tailwind opacity syntax (`/20`), not `bg-opacity-20`.

### Shared components (`src/components`)

- `Button` - `variant`: `primary` | `solid` | `outline` | `ghost`; `size`: `large` | `medium` | `small` | `icon`. Use it instead of raw `<button>` for actions.
- `PageHeader` - back link + title + description (+ `actions`). Every page with a back button uses it.
- `Card`, `Input`, `Modal`, `ConfirmDialog`, `SettingRow` / `SettingToggle` / `SettingButtonGroup` / `SettingNumberInput`.

## Icon Usage

**Always use Basil Icons** for all icons in this project. The project uses `@iconify/react` with Basil solid icons.

### Import Pattern

```jsx
import { Icon } from '@iconify/react';
```

### Usage Example

```jsx
<Icon icon="basil:icon-name-solid" className="w-6 h-6" />
```

### Common Icons Used

- `basil:arrow-left-solid` - Back/previous navigation
- `basil:arrow-right-solid` - Forward/next navigation
- `basil:check-solid` - Success/completed states
- `basil:close-solid` - Close/remove/delete actions
- `basil:dice-solid` - Dice-related features
- `basil:lightning-solid` - Quick/instant actions
- `basil:lock-solid` - Locked/restricted features

**Important:** 
- Always use the **solid** version of Basil icons (suffix: `-solid`)
- Icon names follow the pattern: `basil:icon-name-solid`
- Browse available icons at [basicons.xyz](https://basicons.xyz) or [yesicon.app/basil](https://yesicon.app/basil)

### Icon Sizing Guidelines

- Small icons: `w-4 h-4` (16px) - inline with small text
- Medium icons: `w-5 h-5` (20px) - buttons, scorecard indicators
- Large icons: `w-6 h-6` (24px) - tab labels, prominent actions
- Extra large: `w-8 h-8` (32px) - feature highlights

**Note:** Icons inherit `currentColor`, so `text-fg` on a parent (or the icon) is all that's needed.
