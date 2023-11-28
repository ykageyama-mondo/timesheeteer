import { DropdownSelect } from '@/components/DropdownSelect';
import { ChangeEvent, useEffect } from 'react';
import { FaFillDrip, FaPlus, FaTrash } from 'react-icons/fa';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { expandTimeTypes, timeOptions, workOptions } from '../config';
import { FiPlus, FiSave } from 'react-icons/fi';

interface TimePickerProps {
  name: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ name }) => {
  const { register, setFocus, setValue } = useFormContext();

  const onHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 2) return;
    if (value.length === 0) {
      return;
    }

    const parsed = parseInt(value);
    if (isNaN(parsed)) return;
    const clamped = '' + Math.min(Math.max(parsed, 0), 23);
    const hour = clamped.padStart(value.length, '0');
    setValue(`${name}.hour`, hour);

    if (hour.length === 2) {
      setFocus(`${name}.min`);
    }
  };

  const onMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 2) return;
    if (value.length === 0) {
      return;
    }

    const parsed = parseInt(e.target.value);
    if (isNaN(parsed)) return;
    const clamped = '' + Math.min(Math.max(parsed, 0), 59);
    const min = clamped.padStart(value.length, '0');
    setValue(`${name}.min`, min);
    // if (min.length === 2) {
    //   logger.log(nextRef)
    //   nextRef?.current?.focus()
    // }
  };

  const { ref: hourRef, ...hourRest } = register(`${name}.hour`, {
    required: true,
    onChange: (e) => {
      onHourChange(e);
    },
  });
  const { ref: minRef, ...minRest } = register(`${name}.min`, {
    required: true,
    onChange: (e) => {
      onMinChange(e);
    },
  });

  return (
    <div className="flex border rounded-full focus-within:border-rose-400 hover:border-rose-300 bg-stone-50 border-stone-200 h-9">
      <input
        autoComplete="off"
        ref={hourRef}
        placeholder="00"
        maxLength={2}
        tabIndex={2}
        type="text"
        className="w-12 overflow-hidden text-center bg-transparent focus:outline-none"
        {...hourRest}
      />
      <span className="text-lg font-bold">:</span>
      <input
        autoComplete="off"
        placeholder="00"
        ref={minRef}
        maxLength={2}
        tabIndex={2}
        type="text"
        className="w-12 overflow-hidden text-center bg-transparent focus:outline-none"
        {...minRest}
      />
    </div>
  );
};

const Record = ({
  onRemove,
  index,
}: {
  onRemove: () => void;
  index: number;
}) => {
  const { watch, unregister } = useFormContext();

  const timeType = watch(`records.${index}.timeType` as const);

  useEffect(() => {
    if (!expandTimeTypes.includes(timeType)) {
      unregister(`records.${index}.workType` as const);
    }
  }, [timeType, index, unregister]);

  return (
    <div className="flex flex-col gap-2 text-lg font-bold">
      <div className="flex items-center gap-2">
        I{' '}
        <DropdownSelect
          options={timeOptions}
          placeHolder="worked"
          name={`records.${index}.timeType` as const}
        />
        <button
          tabIndex={-1}
          type="button"
          className="transition-all group ml-auto p-2 rounded-full hover:bg-stone-200"
          onClick={onRemove}
        >
          <FaTrash className="w-4 h-4 text-rose-400 hover group-hover:text-rose-500 transition-all " />
        </button>
      </div>

      <div className="flex items-center justify-start gap-2">
        from <TimePicker name={`records.${index}.from`} />
        to <TimePicker name={`records.${index}.to`} />
      </div>
      {expandTimeTypes.includes(timeType) && (
        <div
          key={`workType${index}`}
          className="flex items-center justify-start gap-2"
        >
          on{' '}
          <DropdownSelect
            options={workOptions}
            placeHolder="CAPEX"
            name={`records.${index}.workType` as const}
          />{' '}
        </div>
      )}
    </div>
  );
};

const lenMessage = `I think you forgot something. Not sure what... Might be your ENTIRE TIMESHEET 😠`;
interface RecordListProps {
  onCreatePreset: () => void;
}
export const RecordList: React.FC<RecordListProps> = ({ onCreatePreset }) => {
  const { control } = useFormContext();
  const {
    append: appendRecord,
    fields: records,
    remove: removeRecord,
  } = useFieldArray({
    control,
    name: 'records',
    rules: {
      minLength: { value: 1, message: lenMessage },
      required: { value: true, message: lenMessage },
    },
  });

  const handleAddRecord = () => {
    appendRecord({
      record: {
        from: {},
        to: {},
      },
    });
  };

  const handleRemoveRecord = (index: number) => {
    removeRecord(index);
  };

  return (
    <div className="flex flex-col gap-2 h-[450px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-transparent">
      {records.length ? (
        records.map((field, i) => (
          <div
            key={field.id}
            className="p-4 text-base bg-stone-400/10 rounded-2xl"
          >
            <Record index={i} onRemove={() => handleRemoveRecord(i)} />
          </div>
        ))
      ) : (
        <div className="p-4 text-base bg-stone-400/10 rounded-2xl">
          No records.
        </div>
      )}
      <div className="flex ml-auto gap-1">
        <button
          type="button"
          onClick={onCreatePreset}
          className="flex justify-center items-center w-fit gap-1 px-4 py-2 text-rose-500 hover:text-rose-700 transition-all duration-300 rounded-full bg-rose-100 hover:bg-rose-200"
        >
          <FiSave className="w-5 h-5" />
          <span>create preset</span>
        </button>
        <button
          type="button"
          onClick={handleAddRecord}
          className="flex justify-center items-center w-fit gap-1 px-4 py-2 text-rose-500 hover:text-rose-700 transition-all duration-300 rounded-full bg-rose-100 hover:bg-rose-200"
        >
          <FiPlus className="w-5 h-5" />
          <span>add a record</span>
        </button>
      </div>

      <button
        type="submit"
        tabIndex={-1}
        className="mt-2 self-center w-full py-4 subpixel-antialiased group flex gap-3 items-center justify-center hover:rounded-[20px] rounded-[40px] transition-all duration-200 border-[3px] border-stone-50 hover:bg-rose-500 bg-rose-600 ring-2 ring-rose-600 ring-opacity-0 hover:ring-opacity-100 hover:ring-rose-400 text-4xl text-stone-50"
      >
        <FaFillDrip className="text-lg group-hover:text-rose-50 transition-all duration-200" />
        <span className="text-base transition-all duration-100 group-hover:font-bold tracking-wide">
          Fill out Timesheet
        </span>
      </button>
    </div>
  );
};
