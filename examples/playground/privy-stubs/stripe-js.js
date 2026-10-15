// @stripe/crypto (a dependency of @privy-io/react-auth 3.x) imports this peer
// for Privy's Stripe onramp. VeChain Kit uses its own onramp, so the package is
// aliased to this stub instead of being installed. See next.config.js.
export function loadStripe() {
    return Promise.reject(new Error('@stripe/stripe-js is not installed'));
}
