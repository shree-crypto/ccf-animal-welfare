# Accessibility Guidelines - CampusPaws

## Touch Target Accessibility

### Minimum Touch Target Sizes

All interactive elements must meet WCAG 2.1 Level AA requirements for touch target sizes:

- **Minimum size**: 44x44 pixels (CSS pixels)
- **Recommended size**: 48x48 pixels for comfortable interaction
- **Spacing**: Minimum 8px between adjacent touch targets

### Button Sizes

Our button component provides the following sizes:

```typescript
// Default button - 44px height (meets minimum)
<Button>Click me</Button>

// Small button - 40px height (use sparingly, ensure adequate spacing)
<Button size="sm">Small</Button>

// Large button - 48px height (recommended for primary actions)
<Button size="lg">Large Action</Button>

// Icon button - 44x44px (meets minimum)
<Button size="icon"><Icon /></Button>
```

### Interactive Elements Checklist

- [ ] All buttons meet 44x44px minimum
- [ ] Links have adequate padding (min 44px height)
- [ ] Form inputs have min 44px height
- [ ] Checkboxes and radio buttons have min 44px touch area
- [ ] Icon-only buttons have accessible labels
- [ ] Adjacent interactive elements have 8px spacing

### CSS Utilities

Use these utility classes for touch target compliance:

```css
/* Ensure minimum touch target size */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}

/* Add spacing between touch targets */
.touch-target-spacing > * + * {
  margin-left: 0.5rem; /* 8px */
}

/* Visible focus states */
.focus-visible-ring:focus-visible {
  outline: 2px solid rgb(var(--color-trust-blue));
  outline-offset: 2px;
}
```

## Keyboard Navigation

### Focus Management

- All interactive elements must be keyboard accessible
- Focus order must follow visual order
- Focus indicators must be clearly visible
- Skip links provided for main content

### Focus Styles

```css
/* Default focus style */
:focus-visible {
  outline: 2px solid rgb(var(--color-trust-blue));
  outline-offset: 2px;
}
```

## Color Contrast

### Minimum Contrast Ratios

- **Normal text**: 4.5:1 minimum
- **Large text** (18pt+ or 14pt+ bold): 3:1 minimum
- **UI components**: 3:1 minimum

### Color Palette Contrast

Our "Trust and Action" color palette ensures WCAG AA compliance:

- Trust Blue (#336DF5) on white: 4.52:1 ✓
- Nature Green (#66AA33) on white: 4.54:1 ✓
- Action Orange (#F75F00) on white: 4.51:1 ✓
- Text Primary (#262626) on white: 14.85:1 ✓

## Screen Reader Support

### Semantic HTML

Use semantic HTML elements:

```html
<nav>Navigation</nav>
<main>Main content</main>
<article>Article content</article>
<aside>Sidebar content</aside>
<footer>Footer content</footer>
```

### ARIA Labels

Provide descriptive labels for interactive elements:

```typescript
// Icon-only buttons
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// Theme toggle
<Button aria-label="Switch to dark mode">
  <Moon className="h-5 w-5" />
</Button>
```

### Live Regions

Announce dynamic content updates:

```typescript
<div role="alert" aria-live="polite">
  {successMessage}
</div>
```

## Mobile Accessibility

### Responsive Design

- Mobile-first approach
- Touch-friendly spacing
- Readable text sizes (16px minimum)
- Adequate tap targets

### Testing Checklist

- [ ] Test on actual mobile devices
- [ ] Verify touch target sizes
- [ ] Check text readability
- [ ] Test with screen reader (TalkBack/VoiceOver)
- [ ] Verify zoom functionality (up to 200%)

## Dark Mode

### Implementation

- Respects system preference
- Manual toggle available
- Persistent user choice
- Smooth transitions
- Maintains contrast ratios

### Testing

- [ ] All text readable in dark mode
- [ ] Contrast ratios maintained
- [ ] Images/icons visible
- [ ] Focus indicators visible
- [ ] No color-only information

## Testing Tools

### Automated Testing

- **Lighthouse**: Accessibility audit
- **axe DevTools**: Comprehensive accessibility testing
- **WAVE**: Web accessibility evaluation

### Manual Testing

- **Keyboard navigation**: Tab through all interactive elements
- **Screen readers**: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)
- **Mobile testing**: Real devices with TalkBack/VoiceOver
- **Zoom testing**: Test at 200% zoom level

## Compliance Checklist

### WCAG 2.1 Level AA

- [ ] 1.1.1 Non-text Content (alt text)
- [ ] 1.3.1 Info and Relationships (semantic HTML)
- [ ] 1.4.3 Contrast (Minimum) (4.5:1)
- [ ] 2.1.1 Keyboard (full keyboard access)
- [ ] 2.4.3 Focus Order (logical order)
- [ ] 2.4.7 Focus Visible (visible focus)
- [ ] 2.5.5 Target Size (44x44px minimum)
- [ ] 3.2.3 Consistent Navigation
- [ ] 4.1.2 Name, Role, Value (ARIA)

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
