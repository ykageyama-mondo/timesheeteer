export type DeepRequire<T> = T extends Record<any, any> ? {
  [K in keyof T]-?: DeepRequire<T[K]>
} : T

export type Optional<T extends Record<any, any>, K extends keyof T> = Omit<T, K> & {
  [J in K]?: T[J]
}