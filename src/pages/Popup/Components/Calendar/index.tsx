import { useState } from 'react';
import ReactCalendar from 'react-calendar';
import { TileArgs } from 'react-calendar/dist/cjs/shared/types';
import './index.css';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import {dateExists, datesExcept} from '@/helpers/date'

interface Props {
  initialDates: Date[];
  onSubmit: (dates: Date[]) => void;
  show: boolean;
  setShow: (show: boolean) => void;
}

export const CalendarModal: React.FC<Props> = ({
  initialDates,
  onSubmit,
  setShow,
  show,
}) => {
  const [dates,setDates] = useState(initialDates)
  const onClickDay = (date: Date) => {
    if (dateExists(dates, date)) setDates(datesExcept(dates, date));
    else setDates([...dates, date]);
  };

  const tileClassName = ({ date }: TileArgs) => {
    if (dateExists(dates, date))
      return ['bg-rose-500', 'text-white', 'rounded-full', 'hover:bg-rose-400'];
    return ['hover:bg-rose-200'];
  };

  return (
    <div hidden={!show}>
    <div className="mx-4 p-2 border border-stone-200 rounded-lg bg-stone-100 absolute top-12 w-[320px] drop-shadow-lg z-50" >
      <ReactCalendar
        goToRangeStartOnSelect={false}
        minDetail="month"
        tileClassName={tileClassName}
        onClickDay={onClickDay}
        prevLabel={<MdChevronLeft className="ml-1 h-6 w-6 text-stone-50" />}
        nextLabel={<MdChevronRight className="ml-1 h-6 w-6 text-stone-50" />}
      />
      <button className="w-full px-4 py-2 bg-rose-500 text-stone-50 font-bold text-sm rounded-full mt-2" onClick={() => {setShow(false); onSubmit(dates)}}>
        {dates.length} days
      </button>
    </div>
    <div className="bg-stone-900/10 backdrop-blur-sm top-0 absolute h-full w-full z-40" onClick={() => setShow(false)}></div>
    </div>
    
  );
};
