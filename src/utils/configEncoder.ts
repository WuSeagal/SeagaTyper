export interface DisplayConfig {
  c: string             // channel (頻道帳號)
  ts: number            // typingSpeed
  fs: number            // fontSize
  fc: string            // fontColor
  ff: string            // fontFamily
  fw: string            // fontWeight
  sn: boolean           // showName
  mld: number           // messageLineDuration
  md: number            // messageDuration
  lmd: number           // lastMessageDuration
  mma: number           // maxMessageAwait
  ild: boolean          // isLimitDisplay
  wl?: string[]         // whiteList
  bl?: string[]         // blackList
  dr?: number[]         // displayRoles
  ds?: boolean          // displaySubs
  sml?: number          // subMonthsLimit
  db?: boolean          // displayBits
  cbl?: number          // cheerBitsLimit
}

export function toUrlSafeBase64(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function fromUrlSafeBase64(urlSafeBase64: string): string {
  let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) base64 += '='
  return base64
}

export function encodeConfig(config: DisplayConfig): string {
  const json = JSON.stringify(config)
  const base64 = btoa(encodeURIComponent(json))
  return toUrlSafeBase64(base64)
}

export function decodeConfig(encoded: string): DisplayConfig | null {
  try {
    const base64 = fromUrlSafeBase64(encoded)
    const jsonStr = decodeURIComponent(atob(base64))
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('decodeConfig error:', e)
    return null
  }
}