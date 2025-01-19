import { NFTMediaType } from "@/types"

const isValidMimeType = (mime: string, type: NFTMediaType[]) => {
  const found = type.find(t => {
    if (mime?.split("/")[0] === t) {
      return true
    }
  })

  return !!found
}

export const resolveMediaTypeFromMimeType = (mimeType: string): NFTMediaType => {
  if (isValidMimeType(mimeType, [NFTMediaType.IMAGE])) return NFTMediaType.IMAGE
  else if (isValidMimeType(mimeType, [NFTMediaType.VIDEO])) return NFTMediaType.VIDEO

  return NFTMediaType.UNKNOWN
}
