# Shared Feature

Este módulo contiene componentes, hooks, utils y tipos que son **reutilizables entre múltiples features**.

## 📦 Estructura

```
shared/
├── components/     # Componentes UI transversales
├── hooks/          # Hooks personalizados compartidos
├── utils/          # Funciones de utilidad
├── types/          # Tipos TypeScript compartidos
└── index.ts        # Exports públicos
```

## ✅ Qué va aquí

- **Componentes genéricos** que se usan en 2+ features (tablas, modales genéricos, formularios base)
- **Hooks reutilizables** (useDebounce, useLocalStorage, etc.)
- **Funciones de utilidad** (formatters, validators, calculators)
- **Tipos compartidos** que no pertenecen a un feature específico

## ❌ Qué NO va aquí

- Componentes específicos de un solo feature → Van en el feature correspondiente
- UI primitivos (buttons, inputs) → Van en `/src/components/ui/`
- Layout components (sidebar, header) → Van en `/src/components/layout/`
- Lógica de negocio específica → Va en el feature correspondiente

## 📝 Ejemplo de uso

```typescript
// En cualquier feature
import { formatCurrency, useDebounce } from '@/features/shared'
```
