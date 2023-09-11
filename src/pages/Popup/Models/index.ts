export * from './preset'
export interface RecordItem {
  from: {
    hour?: string
    min?: string
  }
  to: {
    hour?: string
    min?: string
  }
  workType?: string
  timeType?: string
}

export type DeepRequired<T> = {
  [P in keyof Required<T>]: DeepRequired<Required<T>[P]>
}
export type ValidatedRecordItem = DeepRequired<RecordItem>