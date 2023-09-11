import {
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  ReactElement,
} from 'react';
import {useFormContext} from 'react-hook-form'
import { FaChevronCircleUp, FaChevronDown } from 'react-icons/fa';

interface DropdownSelectProps {
  options: string[];
  placeHolder?: string;
  name: string;
}

export const DropdownSelect = ({
  options,
  placeHolder,
  name,
}: DropdownSelectProps): ReactElement => {
  const {register, setValue, getValues} = useFormContext()

  const [show, setShow] = useState(false);
  const option = useRef<string | null>(null);
  const [types, setTypes] = useState(options);
  const [search, setSearch] = useState(options.find(v => v === getValues(name))?? '');
  const [targetIndex, setTargetIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    filterOptions(value);
    setSearch(value);
    setShow(true);
  };

  const filterOptions = (value: string) => {
    if (option.current === value) return;
    const lowerValue = value.toLowerCase();
    // TODO: Cache lower options
    const filtered = options.filter((v) => v.toLowerCase().includes(lowerValue));
    setTypes(filtered);
    setTargetIndex(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        setTargetIndex((prev) => {
          const next = prev + 1;
          if (next > options.length - 1) return 0;
          return next;
        });
        break;
      case 'ArrowUp':
        setTargetIndex((prev) => {
          const next = prev - 1;
          if (next > 0) return 0;
          return next;
        });
        break;
      case 'Enter':
        handleSelect(options[targetIndex]);
        break;
    }
  };

  const handleSelect = (t: typeof options[number]) => {
    option.current = t;
    setValue(name, t)
    setSearch(t);
    setShow(false);
  };

  const {onChange, onBlur, ref, ...rest} = register(name, {required: true, onBlur: () => setShow(false)})


  return (
    <div>
      <div className="h-9 font-medium text-center bg-stone-50 border border-stone-200 rounded-full hover:border-rose-300 focus:ring-1 focus:ring-rose-300 px-4 flex items-center gap-3">
        <input
          autoComplete='off'
          tabIndex={2}
          onKeyDown={handleKeyDown}
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
          className="w-[8rem] focus:outline-none bg-transparent placeholder-stone-400"
          value={search}
          placeholder={placeHolder}
          onChange={handleChange}
          ref={(e) => {
            ref(e)
            inputRef.current = e
          }}
          {...rest}
        />
        {show ? (
          <FaChevronCircleUp className="p-1 h-6 w-6 text-stone-400 text-xs cursor-pointer" onClick={() => setShow(false)}/>
          ) : (
          <FaChevronDown className="p-1 h-6 w-6 text-stone-600 text-xs cursor-pointer" onClick={() => {setShow(true); inputRef.current?.focus()}}/>
        )}
      </div>
      <div
        id="dropdown-states"
        hidden={!show || types.length === 0}
        className="mt-1 w-[10rem] absolute z-10 bg-stone-50 divide-y divide-stone-100 rounded-lg shadow"
      >
        <ul className="select-none py-2 text-sm text-stone-700">
          {types.map((type, i) => (
            <li key={type}>
              <button
                tabIndex={-1}
                onMouseDown={() => {
                  handleSelect(type);
                }}
                type="button"
                className={
                  'inline-flex w-full px-4 py-2 text-sm text-stone-700 hover:bg-rose-200 ' +
                  (i === targetIndex ? 'bg-rose-100' : '')
                }
              >
                {type}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
