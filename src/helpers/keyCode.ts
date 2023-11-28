export const keyCodeArray = ['Enter'] as const
export const isSupportedKey = (key: string): key is KeyCode => keyCodeArray.includes(key as KeyCode)
export type KeyCode = (typeof keyCodeArray)[number]
export const supportedKeys: Record<KeyCode, {
  windowsVirtualKeyCode: number;
  unmodifiedText: string;
  text: string;
}> = {
  Enter: {
    windowsVirtualKeyCode: 13,
    unmodifiedText: '\r',
    text: '\r',
  },
} as const