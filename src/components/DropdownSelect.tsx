import {
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  ReactElement,
} from 'react';
import { FaChevronCircleDown, FaChevronRight } from 'react-icons/fa';

export interface DropdownItem<T> {
  label: string;
  value: T;
}

interface DropdownSelectProps<T> {
  options: DropdownItem<T>[];
  onSelect: (item: T) => void;
  placeHolder?: string;
}

export const DropdownSelect = <T,>({
  options,
  onSelect,
  placeHolder,
}: DropdownSelectProps<T>): ReactElement => {
  const [show, setShow] = useState(false);
  const option = useRef<DropdownItem<T> | null>(null);
  const [types, setTypes] = useState(options);
  const [search, setSearch] = useState('');
  const [targetIndex, setTargetIndex] = useState<number>(0);

  const filterOptions = (value: string) => {
    if (option.current?.label === value) return;

    const filtered = options.filter((type) => type.label.includes(value));
    setTypes(filtered);
    setTargetIndex(0);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    filterOptions(value);
    setSearch(value);
    setShow(true);
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
    onSelect(t.value);
    setSearch(t.label);
    setShow(false);
  };

  return (
    <div>
      <div className=" h-9 font-medium text-center bg-stone-50 border border-stone-200 rounded-full hover:border-rose-300 focus:ring-1 focus:ring-rose-300 px-4 flex items-center gap-3">
        <input
          tabIndex={2}
          onKeyDown={handleKeyDown}
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
          onChange={handleChange}
          className="w-[8rem] focus:outline-none bg-transparent placeholder-stone-400"
          value={search}
          placeholder={placeHolder}
        />
        {show ? (
          <FaChevronCircleDown className="text-stone-600 text-xs" />
        ) : (
          <FaChevronRight className="text-stone-400 text-xs" />
        )}
      </div>
      <div
        id="dropdown-states"
        hidden={!show || types.length === 0}
        className="mt-1 w-[10rem] absolute z-10 bg-stone-50 divide-y divide-stone-100 rounded-lg shadow"
      >
        <ul className="select-none py-2 text-sm text-stone-700">
          {types.map((type, i) => (
            <li key={type.label}>
              <button
                onMouseDown={() => {
                  handleSelect(type);
                }}
                type="button"
                className={
                  'inline-flex w-full px-4 py-2 text-sm text-stone-700 hover:bg-rose-200 ' +
                  (i === targetIndex ? 'bg-rose-100' : '')
                }
              >
                {type.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
