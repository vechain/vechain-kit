/**
 * Map strength level coming from contract to hq image
 */
export const NodeStrengthLevelToImage: { [key: string]: string } = {
  "0": "/images/vnt/00-noNode.webp",
  "1": "/images/vnt/01-strength.webp",
  "2": "/images/vnt/02-thunder.webp",
  "3": "/images/vnt/03-mjolnir.webp",
  "4": "/images/vnt/04-vethorX.webp",
  "5": "/images/vnt/05-strengthX.webp",
  "6": "/images/vnt/06-thunderX.webp",
  "7": "/images/vnt/07-mjolnirX.webp",
}

//after this level the nfts are considered xNode
export const MinXNodeLevel = 4
export const EconomicNodeStrengthLevelToName: { [key: string]: string } = {
  "1": "Strength",
  "2": "Thunder",
  "3": "Mjolnir",
}

export const XNodeStrengthLevelToName: { [key: string]: string } = {
  "4": "VeThorX",
  "5": "StrengthX",
  "6": "ThunderX",
  "7": "MjolnirX",
}

export const allNodeStrengthLevelToName: { [key: string]: string } = {
  ...EconomicNodeStrengthLevelToName,
  ...XNodeStrengthLevelToName,
}
