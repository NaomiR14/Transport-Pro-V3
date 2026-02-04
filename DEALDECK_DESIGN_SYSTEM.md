# DealDeck Design System - Transport Pro

## Visual Style Reference
Base your designs on the DealDeck dashboard aesthetic: modern, clean, data-focused with blue color scheme.

## Core Design Principles

### Color Palette (Blue-centric)
- **Primary Blue**: `#3b82f6` (blue-500) for CTAs, active states, primary charts
- **Light Blue**: `#dbeafe` (blue-100) for backgrounds, hover states  
- **Dark Blue**: `#1e40af` (blue-800) for text emphasis
- **Success Green**: `#10b981` (emerald-500) for positive metrics (+2.6%)
- **Danger Red**: `#ef4444` (red-500) for negative metrics (-1.08%)
- **Warning Orange**: `#f59e0b` (amber-500) for alerts
- **Purple Accent**: `#8b5cf6` (violet-500) for secondary charts
- **Neutrals**: Gray scale (50-900) for text and backgrounds

### Layout Structure
1. **Sidebar** (left, fixed width ~240px):
   - White background (dark: dark gray)
   - Logo at top
   - Icon + text navigation items
   - Active item: light blue background (`bg-blue-50`) with blue text
   - Hover: subtle gray background (`bg-gray-100`)
   - Optional upgrade/promo section at bottom

2. **Main Content Area**:
   - Light gray background (`bg-gray-50`)
   - Padding: `p-6` to `p-8`
   - Content max-width for readability

3. **Header Bar** (top of main area):
   - White background with border-bottom
   - Page title + breadcrumb (left)
   - Search, notifications, profile (right)
   - Sticky on scroll

### Component Patterns

#### Stats Cards
```
- White card with subtle shadow
- Small gray label on top (text-sm text-gray-600)
- Large bold number (text-3xl font-bold)
- Icon in top-right with colored background circle
- Change badge below: rounded-full, colored bg (green/red), percentage with arrow
- Example: "Total Sales $612,917" with "+2.6%" green badge
```

#### Data Cards
```
- White rounded cards (rounded-lg)
- Subtle border (border border-gray-200)
- Small shadow on hover (hover:shadow-lg transition-shadow)
- Padding: p-4 to p-6
- Title: font-semibold text-gray-900
- Description: text-sm text-gray-600
```

#### Badges/Pills
```
- Rounded-full
- Small padding: px-2.5 py-1
- Text: text-xs font-semibold
- Colors based on meaning:
  * Green: bg-green-100 text-green-700
  * Red: bg-red-100 text-red-700
  * Blue: bg-blue-100 text-blue-700
  * Orange: bg-orange-100 text-orange-700
```

#### Charts
```
- Use recharts library
- Primary color: blue-500
- Secondary colors: purple, green, orange
- Background: white card
- Legends below or to the side with colored dots
- Tooltips on hover
- Grid lines: subtle gray
```

#### Tables
```
- White background
- Header: uppercase text-xs font-semibold text-gray-700
- Borders: border-b border-gray-200
- Hover: bg-gray-50
- Alternating rows optional (zebra striping)
- Actions column: icon buttons with hover states
```

#### Buttons
```
- Primary: bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2
- Secondary: bg-white border border-gray-300 hover:bg-gray-50 rounded-lg
- Icon buttons: p-2 rounded-lg hover:bg-gray-100
- Danger: bg-red-600 hover:bg-red-700 text-white
```

#### Forms
```
- Labels: text-sm font-medium text-gray-700 mb-1
- Inputs: border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500
- Placeholders: text-gray-400
- Error states: border-red-500 text-red-600
- Helper text: text-xs text-gray-500 mt-1
```

### Typography
- **Headings**: Font-bold, dark gray/black
  - H1: text-2xl to text-3xl
  - H2: text-xl to text-2xl  
  - H3: text-lg to text-xl
- **Body**: text-base text-gray-700
- **Muted**: text-sm text-gray-500
- **Small**: text-xs text-gray-400

### Spacing & Sizing
- **Card gaps**: gap-4 to gap-6
- **Section padding**: p-6 to p-8
- **Element spacing**: space-y-4 or gap-4
- **Border radius**: rounded-lg (0.5rem) for cards, rounded-full for badges
- **Icon size**: h-5 w-5 for inline, h-6 w-6 for emphasis

### Interactions
- **Hover states**: Subtle lift or shadow increase
- **Active states**: Blue background or border
- **Focus states**: Ring-2 ring-blue-500
- **Transitions**: transition-all duration-200 or transition-colors

### Dark Mode
- Background: gray-900 to gray-800
- Cards: gray-800
- Text: gray-100 to gray-300
- Borders: gray-700
- Maintain color accents (blues, greens, reds) but adjust opacity if needed

## Implementation Rules

1. **Always use Tailwind classes** - avoid custom CSS files
2. **Maintain visual hierarchy** - size, weight, color contrast
3. **Consistent spacing** - use 4px scale (p-1, p-2, p-4, p-6, p-8)
4. **Mobile responsive** - start mobile-first, add md: lg: breakpoints
5. **Accessible** - proper contrast ratios, focus states, aria labels
6. **Loading states** - skeleton loaders with animate-pulse
7. **Empty states** - icon + message + action button
8. **Error states** - red accents with clear messaging

## Quick Reference

When creating ANY component, ask:
- ✓ Does it match the blue-centric color scheme?
- ✓ Does it use white cards with subtle shadows?
- ✓ Are stats displayed with large numbers + small labels?
- ✓ Do badges use colored backgrounds (not just borders)?
- ✓ Is the layout clean with proper whitespace?
- ✓ Are interactive elements obvious (hover/focus states)?

## Example Component Structure

```tsx
// Stats Card Example
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-600">Total Vehículos</p>
      <div className="p-2 rounded-lg bg-blue-50">
        <Truck className="h-5 w-5 text-blue-600" />
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <h3 className="text-3xl font-bold text-gray-900">34,760</h3>
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 mt-2">
      ↑ 2.6%
    </span>
  </CardContent>
</Card>
```

Use this guide for ALL UI components to maintain DealDeck consistency throughout the application.
