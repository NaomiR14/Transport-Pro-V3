# Styling Guidelines - Transport Pro V3

Esta guía establece los estándares de diseño basados en el estilo DealDeck para mantener consistencia visual en toda la aplicación.

---

## 🎨 Paleta de Colores

### Colores Principales

```css
/* Primary Colors */
--primary-blue: #4F46E5      /* Indigo-600 */
--primary-purple: #7C3AED    /* Purple-600 */
--primary-dark: #1E293B      /* Slate-800 */

/* Background Colors */
--bg-main: #F8FAFC           /* Slate-50 - Light mode */
--bg-dark: #0F172A           /* Slate-900 - Dark mode */
--bg-card: #FFFFFF           /* White cards */
--bg-card-dark: #1E293B      /* Dark mode cards */

/* Text Colors */
--text-primary: #1E293B      /* Slate-800 */
--text-secondary: #64748B    /* Slate-500 */
--text-muted: #94A3B8        /* Slate-400 */
--text-white: #FFFFFF

/* Border Colors */
--border-light: #E2E8F0      /* Slate-200 */
--border-dark: #334155       /* Slate-700 */
```

### Colores de Estado

```css
/* Success */
--success-bg: #D1FAE5        /* Green-100 */
--success-text: #065F46      /* Green-800 */
--success-border: #34D399    /* Green-400 */

/* Warning */
--warning-bg: #FEF3C7        /* Amber-100 */
--warning-text: #92400E      /* Amber-800 */
--warning-border: #FBBF24    /* Amber-400 */

/* Error */
--error-bg: #FEE2E2          /* Red-100 */
--error-text: #991B1B        /* Red-800 */
--error-border: #F87171      /* Red-400 */

/* Info */
--info-bg: #DBEAFE           /* Blue-100 */
--info-text: #1E40AF         /* Blue-800 */
--info-border: #60A5FA       /* Blue-400 */
```

---

## 🔘 Botones

### Primary Button (Gradient)

```tsx
<Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
  Acción Principal
</Button>
```

**Estilos CSS:**
```css
.btn-primary {
  background: linear-gradient(to right, #2563EB, #7C3AED);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.btn-primary:hover {
  background: linear-gradient(to right, #1D4ED8, #6D28D9);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}
```

### Secondary Button

```tsx
<Button variant="outline" className="border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
  Acción Secundaria
</Button>
```

### Icon Button

```tsx
<Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800">
  <Icon className="h-5 w-5" />
</Button>
```

---

## 📊 Cards (Tarjetas)

### Card Principal

```tsx
<Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800">
  <CardHeader>
    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
      Título
    </CardTitle>
    <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
      Descripción
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Contenido */}
  </CardContent>
</Card>
```

**Estilos CSS:**
```css
.card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.dark .card {
  background: #1E293B;
  border-color: #334155;
}
```

### Stats Card (Tarjeta de Estadísticas)

```tsx
<Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
  <CardContent className="pt-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Título</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          Valor
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 📝 Inputs y Forms

### Input Field

```tsx
<Input 
  placeholder="Buscar..." 
  className="bg-gray-50 dark:bg-gray-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
/>
```

**Estilos CSS:**
```css
.input {
  background: #F8FAFC;
  border: 1px solid #CBD5E1;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: #3B82F6;
  ring: 2px solid rgba(59, 130, 246, 0.2);
}

.dark .input {
  background: #1E293B;
  border-color: #475569;
}
```

### Select Dropdown

```tsx
<Select>
  <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
    <SelectValue placeholder="Seleccionar" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opción 1</SelectItem>
  </SelectContent>
</Select>
```

---

## 🎯 Badges y Pills

### Status Badge

```tsx
{/* Success */}
<Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
  Activo
</Badge>

{/* Warning */}
<Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
  Pendiente
</Badge>

{/* Error */}
<Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
  Inactivo
</Badge>
```

**Estilos CSS:**
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-success {
  background: #D1FAE5;
  color: #065F46;
}

.dark .badge-success {
  background: rgba(16, 185, 129, 0.2);
  color: #34D399;
}
```

---

## 📈 Charts y Gráficos

### Bar Chart Colors

```tsx
const chartColors = {
  primary: '#4F46E5',      // Indigo-600
  secondary: '#7C3AED',    // Purple-600
  tertiary: '#06B6D4',     // Cyan-500
  accent: '#F59E0B',       // Amber-500
}
```

### Chart Container

```css
.chart-container {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
  padding: 1.5rem;
  height: 300px;
}

.dark .chart-container {
  background: #1E293B;
  border-color: #334155;
}
```

---

## 🎨 Gradientes

### Background Gradients

```css
/* Primary Gradient */
.gradient-primary {
  background: linear-gradient(to right, #4F46E5, #7C3AED);
}

/* Dark Gradient */
.gradient-dark {
  background: linear-gradient(to bottom right, #1E293B, #0F172A);
}

/* Card Hover Gradient */
.gradient-hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Text Gradients

```tsx
<h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
  Título con Gradiente
</h1>
```

---

## 🌓 Dark Mode

### Implementación

Todos los componentes deben soportar dark mode usando las clases `dark:`:

```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  Contenido
</div>
```

### Colores Dark Mode

```css
/* Backgrounds */
--dark-bg-primary: #0F172A    /* Slate-900 */
--dark-bg-secondary: #1E293B  /* Slate-800 */
--dark-bg-tertiary: #334155   /* Slate-700 */

/* Text */
--dark-text-primary: #F8FAFC  /* Slate-50 */
--dark-text-secondary: #CBD5E1 /* Slate-300 */
--dark-text-muted: #94A3B8    /* Slate-400 */

/* Borders */
--dark-border: #334155        /* Slate-700 */
--dark-border-light: #475569  /* Slate-600 */
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Tablets */
md: 768px   /* Small laptops */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large */
```

### Grid Layouts

```tsx
{/* Responsive Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

---

## ⚡ Animaciones y Transiciones

### Transiciones Estándar

```css
.transition-standard {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-slow {
  transition: all 0.3s ease-in-out;
}
```

### Hover Effects

```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
}
```

---

## 🔤 Tipografía

### Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Tamaños de Texto

```css
.text-xs:   0.75rem   /* 12px */
.text-sm:   0.875rem  /* 14px */
.text-base: 1rem      /* 16px */
.text-lg:   1.125rem  /* 18px */
.text-xl:   1.25rem   /* 20px */
.text-2xl:  1.5rem    /* 24px */
.text-3xl:  1.875rem  /* 30px */
.text-4xl:  2.25rem   /* 36px */
```

### Font Weights

```css
.font-normal:   400
.font-medium:   500
.font-semibold: 600
.font-bold:     700
```

---

## 📐 Espaciado

### Padding y Margin Estándar

```css
/* Spacing Scale */
p-2:  0.5rem   /* 8px */
p-4:  1rem     /* 16px */
p-6:  1.5rem   /* 24px */
p-8:  2rem     /* 32px */
p-12: 3rem     /* 48px */
```

### Container Padding

```css
/* Contenedor Principal */
.container-padding {
  padding: 1.5rem; /* 24px */
}

@media (min-width: 768px) {
  .container-padding {
    padding: 2rem; /* 32px */
  }
}
```

---

## 🎯 Iconos

### Tamaños de Iconos

```tsx
{/* Small */}
<Icon className="h-4 w-4" />

{/* Medium */}
<Icon className="h-5 w-5" />

{/* Large */}
<Icon className="h-6 w-6" />

{/* Extra Large */}
<Icon className="h-8 w-8" />
```

### Colores de Iconos

```tsx
{/* Primary */}
<Icon className="text-blue-600 dark:text-blue-400" />

{/* Success */}
<Icon className="text-green-600 dark:text-green-400" />

{/* Warning */}
<Icon className="text-amber-600 dark:text-amber-400" />

{/* Error */}
<Icon className="text-red-600 dark:text-red-400" />
```

---

## 🎁 Componentes Especiales

### Upgrade Pro Card (Sidebar)

```tsx
<div className="relative bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 overflow-hidden shadow-lg border border-gray-700">
  {/* Decorative circles */}
  <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
  
  <div className="relative z-10">
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
      <Crown className="h-5 w-5 text-white" />
    </div>
    <h3 className="text-white font-bold text-sm mt-3">Upgrade Pro</h3>
    <p className="text-gray-400 text-xs mb-4">Descripción</p>
    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
      Upgrade $30
    </Button>
  </div>
</div>
```

---

## ✅ Checklist de Consistencia

Al crear nuevos componentes, verificar:

- [ ] ¿Usa la paleta de colores definida?
- [ ] ¿Tiene soporte para dark mode?
- [ ] ¿Los botones usan los estilos correctos?
- [ ] ¿Las transiciones son suaves (0.2s - 0.3s)?
- [ ] ¿Es responsive en todos los breakpoints?
- [ ] ¿Los espaciados son consistentes (múltiplos de 4)?
- [ ] ¿Los iconos tienen el tamaño correcto?
- [ ] ¿Las tarjetas tienen hover effects?
- [ ] ¿Los badges usan los colores de estado correctos?
- [ ] ¿La tipografía usa la escala definida?

---

## 🔗 Referencias

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn/ui**: https://ui.shadcn.com
- **Lucide Icons**: https://lucide.dev
- **Color Palette**: https://tailwindcss.com/docs/customizing-colors

---

*Última actualización: Febrero 2026*
