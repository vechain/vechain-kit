import { StyleFunctionProps, createMultiStyleConfigHelpers } from "@chakra-ui/react"
import { cardAnatomy } from "@chakra-ui/anatomy"

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys)

// define custom styles for funky variant
const variants = {
  base: (props: StyleFunctionProps) =>
    definePartsStyle({
      container: {
        bg: props.colorMode === "dark" ? "#1A1A1A" : "#FFF",
        borderWidth: "1px",
        borderColor: props.colorMode === "dark" ? "#2D2D2F" : "transparent",
      },
      body: {
        padding: "24px",
      },
    }),
  filled: (props: StyleFunctionProps) =>
    definePartsStyle({
      container: {
        bg: props.colorMode === "dark" ? "#2D2D2F" : "#F8F8F8",
      },
      body: {
        padding: "24px",
      },
    }),
  filledSmall: (props: StyleFunctionProps) =>
    definePartsStyle({
      container: {
        bg: props.colorMode === "dark" ? "#2D2D2F" : "#F8F8F8",
      },
      body: {
        padding: "12px",
      },
    }),
  filledWithBorder: (props: StyleFunctionProps) =>
    definePartsStyle({
      container: {
        bg: props.colorMode === "dark" ? "#2D2D2F" : "#FAFAFA",
        borderWidth: "1px",
        borderColor: props.colorMode === "dark" ? "#D5D5D5" : "#D5D5D5",
      },
      body: {
        padding: "24px",
      },
    }),
  baseWithBorder: (props: StyleFunctionProps) =>
    definePartsStyle({
      container: {
        bg: props.colorMode === "dark" ? "#1A1A1A" : "#FFF",
        borderWidth: "1px",
        borderColor: props.colorMode === "dark" ? "#2D2D2F" : "#D5D5D5",
      },
      body: {
        padding: "24px",
      },
    }),
  primaryBoxShadow: () =>
    definePartsStyle({
      container: {
        border: "1px solid #004CFC",
        boxShadow: "0px 0px 16px 0px rgba(0, 76, 252, 0.35)",
      },
      body: {
        padding: "24px",
      },
    }),
  secondaryBoxShadow: (props: StyleFunctionProps) =>
    definePartsStyle({
      container: {
        boxShadow: "inset 0px 0px 100px 5px rgba(177, 241, 108, 1)",
        bg: props.colorMode === "dark" ? "#1A1A1A" : "#FFF",
        borderWidth: "1px",
        borderColor: props.colorMode === "dark" ? "#2D2D2F" : "gray.100",
      },
      body: {
        padding: "24px",
      },
    }),
}

// export variants in the component theme
export const cardTheme = defineMultiStyleConfig({
  variants,
  defaultProps: {
    variant: "base", // default is solid
  },
  baseStyle: {
    container: {
      borderRadius: "16px",
    },
  },
})
