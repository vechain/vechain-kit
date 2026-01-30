# Bottomsheet

On mobile devices, using bottom sheets instead of modals can enhance the user experience by providing a more intuitive and unobtrusive way to present information. Bottom sheets slide up from the bottom of the screen, allowing users to continue interacting with the rest of the app while accessing additional content or actions.&#x20;

{% embed url="https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/mockup.mp4" %}

To enable this feature, simply set the property `useBottomSheetOnMobile` to `true`, offering a seamless transition that maintains user engagement and minimizes disruptions in the app’s interface.

```javascript
<VeChainKitProvider
    theme={{
        modal: {
            useBottomSheetOnMobile: true
        },
    }}
>
    {children}
</VeChainKitProvider>

```
