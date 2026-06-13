# agents.md
## Stack
- Vite + React + TypeScript + Tailwind CSS

## Arquitetura
**Atomic Design** combinado com **Bulletproof React**.

```
src/
├── assets/
├── components/
│   ├── atoms/        # Button, Input, Label, Badge...
│   ├── molecules/    # FormField, SearchBar, Card...
│   ├── organisms/    # Header, Sidebar, DataTable...
│   └── templates/    # PageLayout, AuthLayout...
├── features/         # Módulos por domínio (Bulletproof React)
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── index.ts
├── hooks/            # Hooks globais reutilizáveis
├── lib/              # Configurações de libs (ex: axios, queryClient)
├── pages/            # Rotas (apenas composição de templates + features)
├── types/            # Tipos globais
└── utils/            # Funções utilitárias puras
```

## Regras
### Componentes
- Um componente = uma responsabilidade (SRP).
- Máximo **15 linhas** por função ou handler.
- Extraia lógica para hooks customizados quando o componente crescer.
- Exporte sempre pelo `index.ts` da pasta.
- Use Tailwind para estilização; nunca sobrescreva estilos inline.

### Hooks
- Prefixo `use` obrigatório.
- Cada hook resolve apenas uma preocupação.
- Máximo 15 linhas por função interna ao hook; extraia helpers para `utils/` se necessário.

### Tipagem
- Sem `any`. Use `unknown` quando o tipo for incerto e faça narrowing.
- Props tipadas com `interface` (não `type`) para componentes React.
- Tipos de domínio ficam em `features/[feature]/types/`.

### Estilo
- Classes Tailwind no JSX; sem CSS modules, sem styled-components.
- Variantes de componentes via `cva` (class-variance-authority) quando houver múltiplos estados visuais.
- Tokens de design centralizados no `tailwind.config.ts`.

### Skills
- Prefira sempre skills de projeto e globais disponíveis antes de gerar código do zero.

### Qualidade
- Funções com mais de 15 linhas devem ser refatoradas — sem exceções.
- Sem lógica de negócio em componentes; use hooks ou `utils/`.
- Imports absolutos a partir de `src/` (configure em `tsconfig.json` com `paths`).

## Exemplo de componente átomo
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