// app home page
export const HOMEPAGE = "http://localhost:3000/"

export const PRIVY_TEST_EMAIL_SENDER = "test-1392@privy.io"
export const PRIVY_TEST_EMAIL_RECEIVER = "test-1392+recipient@privy.io"
export const PRIVY_TEST_EMAIL = (prefix?: string) =>
    `test-1392${prefix ? `+${prefix}` : ''}@privy.io`
export const DENIAL_KITCHEN = [
    "0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa",
    "0x435933c8064b4Ae76bE665428e0307eF2cCFBD68",
    "0x0F872421Dc479F3c11eDd89512731814D0598dB5",
    "0xF370940aBDBd2583bC80bfc19d19bc216C88Ccf0",
    "0x99602e4Bbc0503b8ff4432bB1857F916c3653B85",
]
export const VW_RECIPIENT_ALIAS = 'kitchenpet1'
export const PRIVY_RECIPIENT_ALIAS = 'privyrecipient1'
export const DOMAIN_STATUS = {
    available: 'AVAILABLE',
    unavailable: 'UNAVAILABLE',
    taken: 'This domain is already taken',
    own: 'YOU OWN THIS',
    protected: 'This domain is protected',
}