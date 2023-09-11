import {atom} from 'jotai'
import {RecordItem} from '../Models'
import {PageKey} from '../Models/pages'

const _recordsAtom = atom<RecordItem[]>([])
export const recordsAtom = atom<RecordItem[], ([{type?: 'Add', record: RecordItem, index?: number} | {type: 'Remove', index: number}]), RecordItem[]>(
  [],
  (get, set, props) => {
    const records = get(_recordsAtom)
    const newRecords = [...records]
    if (props.type === 'Remove')
      newRecords.splice(props.index, 1)
    else if (props.index === undefined)
      newRecords.push(props.record)
    else
      newRecords[props.index] = props.record
    set(_recordsAtom, newRecords)
    return newRecords
  }
)

export const pageAtom = atom<PageKey>('home')