export type DeployUpgradeOptions = {
    libraries?: { [libraryName: string]: string }[]
    versions?: (number | undefined)[]
    logOutput?: boolean
  }
  