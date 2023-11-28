import {DeepRequire, Optional} from '@/helpers/types'
import {RecordItem} from '.'

export interface Preset {
  name: string;
  records: Optional<DeepRequire<RecordItem>, 'workType'>[]
}

declare const pre: Preset
