// @privy-io/react-auth 3.x imports this optional peer from its Solana funding
// screen. VeChain Kit never reaches that screen, so the package is aliased to
// this stub instead of being installed. See next.config.js.
export function getTransferSolInstruction() {
    throw new Error('@solana-program/system is not installed');
}
