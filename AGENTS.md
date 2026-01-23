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

**Always use Hugeicons** for all icons in this project. The project uses `@hugeicons/react` and `@hugeicons/core-free-icons`.

### Import Pattern

```jsx
import { HugeiconsIcon } from '@hugeicons/react';
import { IconName } from '@hugeicons/core-free-icons';
```

### Usage Example

```jsx
<HugeiconsIcon 
  icon={IconName} 
  className="w-6 h-6" 
  style={{ color: textColor }}
/>
```

### Common Icons Used

- `ArrowLeft01Icon` - Back/previous navigation
- `ArrowRight01Icon` - Forward/next navigation
- `CheckmarkCircle01Icon` - Success/completed states
- `Close` - Close/remove/delete actions (no Icon suffix)
- `DiceIcon` - Dice-related features
- `Lightning` - Quick/instant actions (no Icon suffix)
- `LockIcon` - Locked/restricted features

**Important:** Icon naming is inconsistent in the Hugeicons library:
- Some icons end with `Icon` suffix (e.g., `ArrowLeft01Icon`, `DiceIcon`, `LockIcon`)
- Some icons don't have the suffix (e.g., `Lightning`, `Close`)
- Always verify the exact export name when adding new icons

### Icon Sizing Guidelines

- Small icons: `w-4 h-4` (16px) - inline with small text
- Medium icons: `w-5 h-5` (20px) - buttons, scorecard indicators
- Large icons: `w-6 h-6` (24px) - tab labels, prominent actions
- Extra large: `w-8 h-8` (32px) - feature highlights

**Note:** Icons automatically inherit text color when used with `style={{ color: textColor }}`. For dark/light mode, use the same color system as text.
