import {DropdownSelect} from '@/components/DropdownSelect'
import {logger} from '@/helpers/logger'
import { ChangeEvent, useRef, useState, forwardRef } from 'react';
import {toast} from 'react-hot-toast'
import { FaPlus } from 'react-icons/fa';


interface Time {
  hour: string;
  min: string;
}

interface TimePickerProps {
  nextRef?: React.MutableRefObject<HTMLInputElement | null>;
}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(({nextRef}, ref) => {
  const [time, setTime] = useState<Time>({ hour: '', min: '' });
  const minTimeRef = useRef<HTMLInputElement>(null);

  const onHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 2) return;
    if (value.length === 0) {
      setTime({ ...time, hour: '' });
      return;
    }

    const parsed = parseInt(value);
    if (isNaN(parsed)) return;
    const clamped = '' + Math.min(Math.max(parsed, 0), 23);
    const hour = clamped.padStart(value.length, '0')
    setTime({ ...time, hour});
    if (hour.length === 2) {
      minTimeRef.current?.focus();
    }
  };

  const onMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 2) return;
    if (value.length === 0) {
      setTime({ ...time, min: '' });
      return;
    }

    const parsed = parseInt(e.target.value);
    if (isNaN(parsed)) return;
    const clamped = '' + Math.min(Math.max(parsed, 0), 59);
    const min = clamped.padStart(value.length, '0')

    setTime({ ...time, min});
    if (min.length === 2) {
      logger.log(nextRef)
      nextRef?.current?.focus();
    }
  };
  return (
    <div className="focus-within:border-rose-300  rounded-full bg-stone-50 flex border border-stone-200 h-9">
      <input
        ref={ref}
        placeholder="00"
        onChange={onHourChange}
        maxLength={2}
        tabIndex={2}
        type="text"
        value={time.hour}
        className="w-12 text-center overflow-hidden bg-transparent focus:outline-none"
      />
      <span className="font-bold text-lg">:</span>
      <input
        placeholder="00"
        ref={minTimeRef}
        onChange={onMinChange}
        maxLength={2}
        tabIndex={2}
        type="text"
        value={time.min}
        className="w-12 text-center overflow-hidden bg-transparent focus:outline-none"
      />
    </div>
  );
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
];

const workTypes = [
  {
    label: 'CAPEX',
    value: 'CAPEX'
  },
  {
    label: 'OPEX',
    value: 'OPEX'
  },
];

const Record = () => {
  const [timeType, setTimeType] = useState<typeof timeTypes[number]['value']>();

  const toRef = useRef(null);
  const workTypeRef = useRef<typeof workTypes[number]['value'] | null>(null);
  const handleWorkTypeSelect = (workType: typeof workTypes[number]['value']) => {
    workTypeRef.current = workType;
  }

  const handleTimeTypeSelect = (tt: typeof timeTypes[number]['value']) => {
    setTimeType(tt)
  }


  return (
    <div className="text-lg font-bold flex flex-col gap-2">
      <div className="gap-2 flex justify-start items-center ">
        I <DropdownSelect onSelect={handleTimeTypeSelect} options={timeTypes} placeHolder='worked'/>
      </div>

      <div className="flex justify-start items-center  gap-2">
        From <TimePicker nextRef={toRef}/>
        To <TimePicker ref={toRef}/>
      </div>
      {timeType === 'Normal Time' && <div className="flex justify-start items-center  gap-2">
        Doing <DropdownSelect onSelect={handleWorkTypeSelect} options={workTypes} placeHolder='CAPEX'/> work
      </div>}
    </div>
  );
};

export const RecordList = () => {
  const [records, setRecords] = useState<RecordItem[]>([])

  const handleAddRecord = () => {
    toast('hello')
    const prev = records[records.length - 1]
    setRecords([...records, {
      from: {
        hour: prev?.to.hour ?? '00',
        min: prev?.to.min ?? '00',
      },
      to: {
      },
    }])

  }

  return (
    <div className="flex flex-col gap-2 h-[450px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-transparent">
      {records.map((record, i) => (
        <div className="text-base p-4 bg-stone-400/10 rounded-2xl">
          <Record />
        </div>
      ))}

      <button onClick={handleAddRecord} className="group gap-2 w-full flex justify-center items-center bg-rose-200 hover:bg-rose-300 transition-all duration-300 hover:ring ring-rose-200 hover:font-bold p-4 rounded-full mt-2 text-base">
        <FaPlus className=" w-5 h-5 text-rose-500 group-hover:text-rose-700 transition-colors duration-300" />
        <span>Record Time</span>
      </button>
    </div>
  );
};

interface RecordItem {
  from: {
    hour?: string;
    min?: string;
  };
  to: {
    hour?: string;
    min?: string;
  };
  workType?: string;
  timeType?: string;
}