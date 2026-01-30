# CSS Framework Conflicts

VeChain Kit uses Chakra UI internally, which can cause style conflicts with Tailwind CSS, Bootstrap, and other CSS frameworks.

### Problem: Styles Being Overridden

#### Symptoms

* Your Tailwind utilities stop working
* Unexpected borders on images
* Wrong background colors or fonts
* Button/form styles change unexpectedly

### Solution: CSS Layer Configuration

Use CSS layers to control which styles take precedence:

```css
/* In your global CSS file (e.g., globals.css) */

/* 1. Define layers with explicit priority */
@layer vechain-kit, host-app;

/* 2. Wrap your framework in host-app layer */
@layer host-app {
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    /* Your custom styles here */
}
```

**Framework-Specific Examples**

**Tailwind CSS**

```bash
@layer vechain-kit, host-app;

@layer host-app {
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
}
```

**Tailwind v4**

```
@layer vechain-kit, host-app;

/* Import Tailwind v4 */
@import "tailwindcss";

/* Your custom styles */
@layer host-app {
    /* Custom overrides */
}
```

Bootstrap

```
@layer vechain-kit, host-app;

@layer host-app {
    @import 'bootstrap/dist/css/bootstrap.css';
}
```

Custom CSS

<pre><code><strong>@layer vechain-kit, host-app;
</strong>
@layer host-app {
    body {
        /* Your body styles */
    }

    .your-components {
        /* Component styles */
    }
}
</code></pre>

Quick Fixes for Common Issues

<pre><code><strong>@layer host-app {
</strong>    /* Fix image borders */
    img {
        border-style: solid !important;
    }

    /* Ensure body styles persist */
    html body {
        background: var(--your-bg);
        font-family: var(--your-font);
    }
}
</code></pre>

**Verification Checklist**

* CSS layers defined: `@layer vechain-kit, host-app`
* Framework styles wrapped in `@layer host-app`
* VeChain Kit imported after layer definitions
* Components render without style conflicts
* No excessive `!important` declarations needed

**Debugging Steps**

1. Check layer order in DevTools - `Styles` panel shows which layer is applied
2. Verify `import` order - CSS with layers must load before VeChain Kit
3. Test in isolation - Create a minimal component to identify conflicts

**Browser Support**

CSS layers are supported in all modern browsers:

* Chrome 99+
* Firefox 97+
* Safari 15.4+
* Edge 99+
