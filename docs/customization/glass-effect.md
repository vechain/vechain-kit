# Glass Effect

Enable and configure glass morphism effects:

```tsx
effects: {
    glass: {
        enabled: true, // Enable glass effects
        intensity: 'low' | 'medium' | 'high', // Glass intensity
    },
    backdropFilter: {
        modal: 'blur(15px)', // Optional: override modal blur
        // overlay blur is set via overlay.blur
    },
}
```

When glass is enabled, the system automatically:

* Applies appropriate blur values based on intensity
* Adjusts background opacities for glass morphism effect
* Maintains readability across all surfaces

**Glass Intensity Settings:**

* `low`: `blur(2px)`, modal opacity 0.6, sticky header opacity 0.7
* `medium`: `blur(3px)`, modal opacity 0.7, sticky header opacity 0.8
* `high`: `blur(5px)`, modal opacity 0.8, sticky header opacity 0.85

<figure><img src="../.gitbook/assets/Group 21 (2).png" alt=""><figcaption></figcaption></figure>

When glass effects are enabled:

* Background colors automatically get reduced opacity based on intensity
* Blur values are applied to modal, overlay, and sticky header
* The system ensures readability while maintaining the glass aesthetic

If glass is disabled, default blur values are still applied (not removed).
