import { extendTheme, keyframes } from '@chakra-ui/react';
import { darkThemeColors, lightThemeColors } from './colors';
import { cardTheme } from './card';
import '@fontsource-variable/instrument-sans';
import '@fontsource-variable/inter';
import { ButtonStyle } from './button';
import { StepperStyle } from './stepper';

const themeConfig = {
    //@ts-ignore
    fonts: {
        heading: `"Instrument Sans Variable", sans-serif`,
        body: `"Inter Variable", sans-serif`,
    },

    components: {
        Card: cardTheme,
        Button: ButtonStyle,
        Stepper: StepperStyle,
    },

    // 2. Add your color mode config
    initialColorMode: 'system',
    useSystemColorMode: true,
    //@ts-ignore
    semanticTokens: {
        colors: {
            'chakra-body-text': {
                _light: '#1E1E1E',
                _dark: '#E4E4E4',
            },
            'chakra-body-bg': {
                _light: '#F7F7F7',
                _dark: '#131313',
            },
        },
    },
    colors: {
        //dynamic primary coor based on the light/dark

        green: {
            '50': '#f3f9f3',
            '100': '#cfe6d0',
            '200': '#a4d1a6',
            '300': '#6fb672',
            '400': '#51a654',
            '500': '#259029',
            '600': '#007b05',
            '700': '#006304',
            '800': '#005403',
            '900': '#003d02',
        },
    },
};

export const pulseKeyFrames = (scaledPulse = 1.5) => keyframes`
        0% {
    transform: scale(1, 1);
    opacity: 1;
  }
  100% {
    transform: scale(${scaledPulse} ${scaledPulse});
    opacity: 0;
  }
    `;

export const backdropBlurKeyframes = (
    startingBlur: string = '0px',
    endingBlur: string = '20px',
) => keyframes`
    0% {
        backdrop-filter: blur(${startingBlur});
    }
    100% {
        backdrop-filter: blur(${endingBlur});
    }
`;

export const backdropBlurAnimation = (
    startingBlur?: string,
    endingBlur?: string,
) => `${backdropBlurKeyframes(startingBlur, endingBlur)} 1s ease-in-out`;

export const TooltipBackgroundColor = (isDark = false) =>
    isDark ? '#CBD5E0' : '#26303E';

export const TooltipTextColor = (isDark = false) =>
    isDark ? '#171923' : 'white';

export const lightTheme = extendTheme({
    ...themeConfig,
    colors: lightThemeColors,
});
export const darkTheme = extendTheme({
    ...themeConfig,
    colors: darkThemeColors,
});
