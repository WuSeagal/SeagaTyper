export type ChatProps = {
  channel: string
  typingSpeed?: number
  fontSize?: number
  fontColor?: string
  fontWeight?: string
  fontFamily?: string
  textWrapMode?: string
  messageLineDuration?: number
  messageDuration?: number
  maxMessageAwait?: number
  lastMessageDuration?: number
  showName?: boolean
  isLimitDisplay?: boolean
  whiteList?: string[]
  displayBroadcaster?: boolean
  displayMod?: boolean
  displayVip?: boolean
  displayFounder?: boolean
  displayTier2Sub?: boolean
  displayTier3Sub?: boolean
  displaySubs?: boolean
  subMonthsLimit?: number
  displayBits?: boolean
  cheerBitsLimit?: number
  blackList?: string[]
}