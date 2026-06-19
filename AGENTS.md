# agents.md
## Stack
- Vite + React + TypeScript + Tailwind CSS

## Architecture
**Atomic Design** combined with **Bulletproof React**.

```
src/
├── assets/
├── components/
│   ├── atoms/        # Button, Input, Label, Badge...
│   ├── molecules/    # FormField, SearchBar, Card...
│   ├── organisms/    # Header, Sidebar, DataTable...
│   └── templates/    # PageLayout, AuthLayout...
├── features/         # Domain modules (Bulletproof React)
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── index.ts
├── hooks/            # Reusable global hooks
├── lib/              # Library configs (e.g. axios, queryClient)
├── pages/            # Routes (only template + feature composition)
├── types/            # Global types
└── utils/            # Pure utility functions
```

## Rules
### Components
- One component = one responsibility (SRP).
- Maximum **15 lines** per function or handler.
- Extract logic to custom hooks when the component grows.
- Always export via the folder's `index.ts`.
- Use Tailwind for styling; never override inline styles.

### Hooks
- `use` prefix is mandatory.
- Each hook addresses only one concern.
- Maximum 15 lines per internal hook function; extract helpers to `utils/` if needed.

### Typing
- No `any`. Use `unknown` when the type is uncertain and perform narrowing.
- Props typed with `interface` (not `type`) for React components.
- Domain types go in `features/[feature]/types/`.

### Styling
- Tailwind classes in JSX; no CSS modules, no styled-components.
- Component variants via `cva` (class-variance-authority) when there are multiple visual states.
- Design tokens centralized in `tailwind.config.ts`.

### Skills
- Always prefer project and global skills before generating code from scratch.

### Quality
- Functions with more than 15 lines must be refactored — no exceptions.
- No business logic in components; use hooks or `utils/`.
- Absolute imports from `src/` (configure in `tsconfig.json` with `paths`).

## Atom component example
```tsx
// src/components/atoms/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes } from 'react'

const button = cva('rounded font-medium transition-colors', {
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    },
    size: { sm: 'px-3 py-1 text-sm', md: 'px-4 py-2' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = ({ variant, size, className, ...props }: ButtonProps) => (
  <button className={button({ variant, size, className })} {...props} />
)
```
```tsx
// src/components/atoms/Button/index.ts
export { Button } from './Button'
export type { ButtonProps } from './Button'
```
