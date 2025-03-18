import { ComponentStyleConfig } from "@chakra-ui/react"

export const ButtonStyle: ComponentStyleConfig = {
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    primarySubtle: {
      rounded: "full",
      fontSize: "16px",
      fontWeight: 500,
      px: "24px",
      bgColor: "#E0E9FE",
      color: "#004CFC",
      _hover: {
        bg: "rgba(224, 233, 254, 0.8)",
      },
    },
    primaryLink: {
      px: 0,
      py: 0,
      fontSize: "16px",
      fontWeight: 500,
      color: "rgba(0, 76, 252, 1)",
      _hover: {
        color: "#0038b5",
        _disabled: {
          color: "rgba(0, 76, 252, 0.7)",
        },
      },
    },
    primaryAction: {
      rounded: "full",
      fontSize: "16px",
      fontWeight: 500,
      px: "24px",
      color: "#FFFFFF",
      bgColor: "rgba(0, 76, 252, 1)",
      _hover: {
        bg: "rgba(0, 76, 252, 0.9)",
        _disabled: {
          bg: "rgba(0, 76, 252, 0.7)",
        },
      },
    },
    tertiaryAction: {
      rounded: "full",
      fontSize: "16px",
      fontWeight: 500,
      px: "24px",
      color: "#004CFC",
      bgColor: "rgba(177, 241, 108, 1)",
      _hover: {
        bg: "rgba(177, 241, 108, 0.9)",
        _disabled: {
          bg: "rgba(177, 241, 108, 0.7)",
        },
      },
    },
    whiteAction: {
      rounded: "full",
      fontSize: "16px",
      fontWeight: 500,
      px: "24px",
      color: "#004CFC",
      bgColor: "rgba(224, 233, 254, 1)",
      _hover: {
        bg: "rgba(224, 233, 254, 0.9)",
        _disabled: {
          bg: "rgba(224, 233, 254, 0.7)",
        },
      },
    },
    secondary: {
      rounded: "full",
      color: "rgba(0, 76, 252, 1)",
      bgColor: "rgba(224, 233, 254, 1)",
      _hover: {
        bg: "#7b818e",
        _disabled: {
          bg: "rgba(224, 233, 254, 0.7)",
        },
      },
    },
    primaryGhost: {
      rounded: "full",
      fontSize: "16px",
      fontWeight: 500,
      px: "24px",
      color: "#004CFC",
      bgColor: "transparent",
      _hover: {
        bg: "#004CFC22",
        _disabled: {
          bg: "transparent",
        },
      },
    },
    dangerGhost: {
      rounded: "full",
      fontSize: "16px",
      fontWeight: 500,
      px: "24px",
      color: "#D23F63",
      bgColor: "transparent",
      _hover: {
        bg: "#D23F6322",
        _disabled: {
          bg: "transparent",
        },
      },
    },
    dangerFilled: {
      rounded: "full",
      fontSize: "16px",
      fontWeight: 500,
      px: "24px",
      color: "#FFFFFF",
      bgColor: "#D23F63",
      _hover: {
        bg: "#cd1e49",
        _disabled: {
          bg: "#D23F63",
        },
      },
    },
    dangerFilledTonal: {
      rounded: "full",
      fontSize: "16px",
      fontWeight: 500,
      px: "24px",
      color: "#D23F63",
      bgColor: "#FCEEF1",
      _hover: {
        bg: "#feccd7",
        _disabled: {
          bg: "#FCEEF1",
        },
      },
    },
    // ICON BUTTON VARIANTS
    // this is strange but seems like icon buttons take the variant from the button
    primaryIconButton: {
      rounded: "full",
      bgColor: "#E0E9FE",
      color: "#004CFC",
      h: "40px",
      w: "40px",
      _hover: {
        bg: "#E0E9FEAA",
      },
    },
    applyButton: {
      rounded: "full",
      fontSize: "16px",
      fontWeight: 500,
      px: "24px",
      bgColor: "#D6FFAA",
      color: "#253C0C",
      _hover: {
        bg: "#E0E9FEAA",
      },
    },
  },
  // default values for 'size', 'variant' and 'colorScheme'
  defaultProps: {
    size: "md",
    rounded: "full",
    variant: "solid",
  },
}
