import { ComponentStyleConfig } from "@chakra-ui/react"

export const StepperStyle: ComponentStyleConfig = {
  // styles for different visual variants ("outline", "solid")
  variants: {
    primaryVertical: {
      indicator: {
        bg: "#E0E9FE",
        "&[data-status=complete]": {
          bg: "#E0E9FE",
        },
        "&[data-status=active]": {
          borderColor: "#E0E9FE",
        },
      },
      separator: {
        "&[data-status=complete]": {
          bg: "#004CFC",
        },
        "&[data-orientation=vertical]": {
          maxHeight: "calc(100% - var(--stepper-indicator-size))",
          top: "calc(var(--stepper-indicator-size))",
          "&[data-status=complete]": {
            maxHeight: "100%",
            top: "calc(var(--stepper-indicator-size)/2)",
            zIndex: 1,
          },
        },
      },
    },
  },
}
