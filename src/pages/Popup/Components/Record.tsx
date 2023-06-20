import {DropdownSelect} from '@/components/DropdownSelect'
import {ChangeEvent, useRef, useState} from 'react'
import {FaPlus, FaTrash} from 'react-icons/fa'
import {useFieldArray, useFormContext} from 'react-hook-form'


interface Time {
  hour: string
  min: string
}

interface TimePickerProps {
  name: string;
}

const TimePicker: React.FC<TimePickerProps> = ({name}) => {
  const [time, setTime] = useState<Time>({hour: '', min: ''})
  const {register, setFocus} = useFormContext()

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
      setFocus(`${name}.min`)
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
    // if (min.length === 2) {
    //   logger.log(nextRef)
    //   nextRef?.current?.focus()
    // }
  }

  const {ref: hourRef, ...hourRest} = register(`${name}.hour`, {
    required: true,
    onChange: (e) => {onHourChange(e)}
  })
  const {ref: minRef, ...minRest} = register(`${name}.min`, {
    required: true,
    onChange: (e) => {onMinChange(e)}
  })

  return (
    <div className="flex border rounded-full focus-within:border-rose-400 hover:border-rose-300 bg-stone-50 border-stone-200 h-9">
      <input
        autoComplete='off'
        ref={hourRef}
        placeholder="00"
        maxLength={2}
        tabIndex={2}
        type="text"
        value={time.hour}
        className="w-12 overflow-hidden text-center bg-transparent focus:outline-none"
        {...hourRest}
      />
      <span className="text-lg font-bold">:</span>
      <input
        autoComplete='off'
        placeholder="00"
        ref={minRef}
        maxLength={2}
        tabIndex={2}
        type="text"
        value={time.min}
        className="w-12 overflow-hidden text-center bg-transparent focus:outline-none"
        {...minRest}
      />
    </div>
  )
}

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

const Record = ({onRemove, index}: {
  onRemove: () => void,
  index: number,
}) => {
  const {getValues} = useFormContext()

  return (
    <div className="flex flex-col gap-2 text-lg font-bold">
      <div className="flex items-center gap-2">
        I <DropdownSelect options={timeTypes} placeHolder='worked' name={`records.${index}.timeType` as const}/>
        <button tabIndex={-1} type='button' className="transition-all group ml-auto p-2 rounded-full hover:bg-stone-200" onClick={onRemove}>
          <FaTrash className="w-4 h-4 text-rose-400 hover group-hover:text-rose-500 transition-all " />
        </button>
      </div>

      <div className="flex items-center justify-start gap-2">
        From <TimePicker name={`records.${index}.from`}/>
        To <TimePicker name={`records.${index}.to`}/>
      </div>
      {
        getValues(`records.${index}.timeType`) === 'Normal Time' && <div className="flex items-center justify-start gap-2">
          Doing <DropdownSelect options={workTypes} placeHolder='CAPEX' name={`records.${index}.workType` as const}/> work
        </div>
      }
    </div >
  )
}

export const RecordList = () => {

  const lenMessage = `I think you forgot something. Not sure what... Might be your ENTIRE TIMESHEET 😠`

  const {control} = useFormContext()
  const {append, fields, remove} = useFieldArray({
    control,
    name: 'records',
    rules: {
      minLength: {value: 1, message: lenMessage},
      required: {value: true, message: lenMessage},
    }
  })

  const handleAddRecord = () => {
    append({record: {
      from: {
      },
      to: {
      },
    }})
  }

  const handleRemoveRecord = (index: number) => {
    remove(index)
  }

  return (
    <div className="flex flex-col gap-2 h-[450px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-transparent">
      {fields.map((field, i) => (
        <div key={field.id} className="p-4 text-base bg-stone-400/10 rounded-2xl">
          <Record index={i} onRemove={() => handleRemoveRecord(i)}/>
        </div>
      ))}

      <button type='button' onClick={handleAddRecord} className="flex items-center justify-center w-full gap-2 p-4 mt-2 text-base transition-all duration-300 rounded-full group bg-rose-200 hover:bg-rose-300 hover:ring ring-rose-200 hover:font-bold">
        <FaPlus className="w-5 h-5 transition-colors duration-300 text-rose-500 group-hover:text-rose-700" />
        <span>Record Time</span>
      </button>
    </div>
  )
};

