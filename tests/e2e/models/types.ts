export type Theme = 'light'|'dark'
export type Language = 'English' | 'Italiano' | 'Deutsch' | 'Français' | 'Español' | '中文' | '日本語'
export type AssetSymbol = 'VET' | 'B3TR' | 'VOT3' | 'VTHO'
export type TxStatus = 'success' | 'error'
export type DomainStatus = 'available' | 'unavailable' | 'taken' | 'own' | 'protected'
export type QuickActionButton = 'swap' | 'receive' | 'send' | 'bridge' | 'ecosystem' | 'settings'
export type AuthType = 'veworld' | 'privy'
export type SettingsSectionName = 'notifications' | 'customize profile' | 'choose account name' | 'connection details' | 'help'
export type NotificationsViewName = 'archived' | 'current'

export type AuthArgs = {
  authType: AuthType;
  accountIndex: number;
  email: string;
}

export type ActivitiesButtonsTranslations = {
  swap: string,
  receive: string,
  send: string,
  bridge: string,
  ecosystem: string,
  settings: string,
}

export type PersonalizationData = {
  displayName?: string,
  description?: string,
  socialLinks?: {
    email?: string,
    website?: string,
    twitter?: string,
  }
}