import { VeBetterIcon, VTHOLogo } from '@/assets';
import { VETLogo } from '@/assets/icons/VechainLogo/VETLogo';
import { VOT3Logo } from '@/assets/icons/VechainLogo/VOT3Logo';

export const TOKEN_LOGOS: Record<string, string> = {
    VET: 'https://cryptologos.cc/logos/vechain-vet-logo.png',
    VTHO: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3012.png',
    B3TR: 'https://vechain.github.io/token-registry/assets/3d55edb42b09a634f7f2f26756a02571de901a5b.png',
    VOT3: 'https://vechain.github.io/token-registry/assets/17ff70aa1d898bc97ad690dbfad1a3b5643f7e0b.png',
    veDelegate:
        'https://vechain.github.io/token-registry/assets/1c641b86096d56bf13d49f38388accd6db8b8b2e.png',
};

export const TOKEN_LOGO_COMPONENTS: Record<string, JSX.Element> = {
    VET: <VETLogo />,
    VTHO: <VTHOLogo />,
    B3TR: <VeBetterIcon />,
    VOT3: <VOT3Logo />,
};

export const VECHAIN_PRIVY_APP_ID = 'cm4wxxujb022fyujl7g0thb21';

export const notFoundImage =
    'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';

export enum TogglePassportCheck {
    WhitelistCheck = 1,
    BlacklistCheck = 2,
    SignalingCheck = 3,
    ParticipationScoreCheck = 4,
    GmOwnershipCheck = 5,
}
