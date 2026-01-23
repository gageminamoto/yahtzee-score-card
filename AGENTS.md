# Agent Guidelines

## Creating New Components

**Always include dark and light mode variants** using Tailwind's `dark:` prefix.

### Quick Reference

```jsx
// Backgrounds
className="bg-black/20 dark:bg-white/20"

// Text
className="text-white dark:text-black"
className="text-white/70 dark:text-black/70"

// Borders
className="border-white dark:border-black"
className="border-white/20 dark:border-black/20"

// Hover states
className="hover:bg-white/10 dark:hover:bg-black/10"
```

### Example

```jsx
<div className="bg-black/20 dark:bg-white/20 p-4">
  <h2 className="text-white dark:text-black">Title</h2>
  <button className="bg-white dark:bg-black text-black dark:text-white">
    Action
  </button>
</div>
```

**Note:** Use Tailwind opacity syntax (`/20`, `/50`) not `bg-opacity-20`.

## Icon Usage

**Always use Basil Icons** for all icons in this project. The project uses `@iconify/react` with Basil solid icons.

### Import Pattern

```jsx
import { Icon } from '@iconify/react';
```

### Usage Example

```jsx
<Icon 
  icon="basil:icon-name-solid" 
  className="w-6 h-6" 
  style={{ color: textColor }}
/>
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

**Note:** Icons automatically inherit text color when used with `style={{ color: textColor }}`. For dark/light mode, use the same color system as text.
