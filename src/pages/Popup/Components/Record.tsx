import {DropdownSelect} from '@/components/DropdownSelect'
import {logger} from '@/helpers/logger'
import {ChangeEvent, useRef, useState, forwardRef} from 'react'
import {FaPlus, FaTrash} from 'react-icons/fa'
import {RecordItem} from './Popup'


interface Time {
  hour: string
  min: string
}

interface TimePickerProps {
  nextRef?: React.MutableRefObject<HTMLInputElement | null>
}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(({nextRef}, ref) => {
  const [time, setTime] = useState<Time>({hour: '', min: ''})
  const minTimeRef = useRef<HTMLInputElement>(null)

  const onHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.length > 2) return
    if (value.length === 0) {
      setTime({...time, hour: ''})
      return
    }

    const parsed = parseInt(value)
    if (isNaN(parsed)) return
    const clamped = '' + Math.min(Math.max(parsed, 0), 23)
    const hour = clamped.padStart(value.length, '0')
    setTime({...time, hour})
    if (hour.length === 2) {
      minTimeRef.current?.focus()
    }
  }

  const onMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length > 2) return
    if (value.length === 0) {
      setTime({...time, min: ''})
      return
    }

    const parsed = parseInt(e.target.value)
    if (isNaN(parsed)) return
    const clamped = '' + Math.min(Math.max(parsed, 0), 59)
    const min = clamped.padStart(value.length, '0')

    setTime({...time, min})
    if (min.length === 2) {
      logger.log(nextRef)
      nextRef?.current?.focus()
    }
  }
  return (
    <div className="flex border rounded-full focus-within:border-rose-300 bg-stone-50 border-stone-200 h-9">
      <input
        ref={ref}
        placeholder="00"
        onChange={onHourChange}
        maxLength={2}
        tabIndex={2}
        type="text"
        value={time.hour}
        className="w-12 overflow-hidden text-center bg-transparent focus:outline-none"
      />
      <span className="text-lg font-bold">:</span>
      <input
        placeholder="00"
        ref={minTimeRef}
        onChange={onMinChange}
        maxLength={2}
        tabIndex={2}
        type="text"
        value={time.min}
        className="w-12 overflow-hidden text-center bg-transparent focus:outline-none"
      />
    </div>
  )
})

const timeTypes = [
  {
    label: 'worked',
    value: 'Normal Time',
  },
  {
    label: 'took a break',
    value: 'Break',
  },
]

const workTypes = [
  {
    label: 'CAPEX',
    value: 'CAPEX'
  },
  {
    label: 'OPEX',
    value: 'OPEX'
  },
]

const Record = ({onRemove}: {onRemove: () => void}) => {
  const [timeType, setTimeType] = useState<typeof timeTypes[number]['value']>()

  const toRef = useRef(null)
  const workTypeRef = useRef<typeof workTypes[number]['value'] | null>(null)
  const handleWorkTypeSelect = (workType: typeof workTypes[number]['value']) => {
    workTypeRef.current = workType
  }

  const handleTimeTypeSelect = (tt: typeof timeTypes[number]['value']) => {
    setTimeType(tt)
  }


  return (
    <div className="flex flex-col gap-2 text-lg font-bold">
      <div className="flex items-center gap-2">
        I <DropdownSelect onSelect={handleTimeTypeSelect} options={timeTypes} placeHolder='worked' />
        <button className="transition-all group ml-auto p-2 rounded-full hover:bg-stone-200" onClick={onRemove}>
          <FaTrash className="w-4 h-4 text-rose-400 hover group-hover:text-rose-500 transition-all " />
        </button>
      </div>

      <div className="flex items-center justify-start gap-2">
        From <TimePicker nextRef={toRef} />
        To <TimePicker ref={toRef} />
      </div>
      {
        timeType === 'Normal Time' && <div className="flex items-center justify-start gap-2">
          Doing <DropdownSelect onSelect={handleWorkTypeSelect} options={workTypes} placeHolder='CAPEX' /> work
        </div>
      }
    </div >
  )
}

export const RecordList = () => {
  const [records, setRecords] = useState<RecordItem[]>([])

  const handleAddRecord = () => {
    const prev = records[records.length - 1]
    setRecords([...records, {
      from: {
        hour: prev?.to.hour,
        min: prev?.to.min,
      },
      to: {
      },
    }])
  }

  const handleRemoveRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-2 h-[450px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-transparent">
      {records.map((record, i) => (
        <div className="p-4 text-base bg-stone-400/10 rounded-2xl">
          <Record onRemove={() => handleRemoveRecord(i)} />
        </div>
      ))}

      <button onClick={handleAddRecord} className="flex items-center justify-center w-full gap-2 p-4 mt-2 text-base transition-all duration-300 rounded-full group bg-rose-200 hover:bg-rose-300 hover:ring ring-rose-200 hover:font-bold">
        <FaPlus className="w-5 h-5 transition-colors duration-300 text-rose-500 group-hover:text-rose-700" />
        <span>Record Time</span>
      </button>
    </div>
  )
};

