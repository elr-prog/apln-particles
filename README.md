# apln-particles

A collection of canvas-based particle and grid animations with APLN branding.

## Animations

### Grid Background Animation (New!)

A grid-based animation with nodes that dapple and randomly emphasize for dynamic background effects.

**Files:**
- `grid-animation.js` - Standalone JavaScript animation
- `grid-background-animation.html` - Complete demo with inline script
- `grid-animation-demo.html` - Demo using external JS file

**Features:**
- Grid-based node structure with configurable spacing
- Continuous dappling effect (pulsing opacity)
- Random node emphasis with elastic scaling animation
- Dynamic connection lines between nearby nodes
- Responsive to window resizing
- APLN color scheme (tan #b9aea1, dark blue #253b53)

**Usage:**
```html
<canvas id="gridCanvas"></canvas>
<script src="grid-animation.js"></script>
```

**Configuration:**
The animation can be customized via `window.gridAnimationConfig`:
```javascript
window.gridAnimationConfig.gridSpacing = 80;
window.gridAnimationConfig.emphasisProbability = 0.005;
```

### APLN Particles Network

Custom particle animation with rhombus shapes representing the APLN logo.

**Files:**
- `apln-particles-init.js` - Main particle animation

**Features:**
- 12,000 particles per viewport
- Slanted rhombus shape (APLN logo)
- Tan color (#b9aea1)
- 200px connection distance
- Continuous drift with wrap-around

### Footer Animation

Lightweight parallax particle animation for footer sections.

**Files:**
- `footer-animation.html` - Complete footer animation

**Features:**
- Lower particle density
- Cream color (#f4f5ef) for dark backgrounds
- 3-layer parallax with mouse tracking
- Bounce-off-edges behavior

### Particles.js Library Demos

External library implementations for reference.

**Files:**
- `index.html`, `particles-v2.html`, `particles-v3.html`
- `particleground.min.js` - Alternative library

## Color Scheme

- **Primary Tan:** #b9aea1
- **Cream:** #f4f5ef
- **Dark Blue:** #253b53
- **Background:** #f4f5ef, #f4f4f2

## Browser Support

All animations use HTML5 Canvas and require modern browser support.