import { useEffect, useState } from 'react';
import './Popup.css';
import { logger } from '@/helpers/logger';
import { FiCalendar, FiPlus, FiSettings, FiSliders } from 'react-icons/fi';
import { CalendarModal } from './Calendar';
import { dateExists } from '@/helpers/date';
import dayjs from 'dayjs';
import {LoadingOverlay} from './LoadingOverlay'

const timeOptions = [
  {
    label: 'worked',
    value: 'Normal Time',
  },
  {
    label: 'took a break',
    value: 'Break',
  },
];

const today = new Date();

const ToolbarButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button onClick={onClick}>
    <div className="text-stone-200 hover:text-stone-100 hover:bg-rose-300 rounded p-1 w-12 flex flex-col justify-center items-center">
      {icon}
      <span className="text-[0.6rem]">{label}</span>
    </div>
  </button>
  );
};

const Popup = () => {
  const [dates, setDates] = useState<Date[]>([today]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalendarSubmit = (d: Date[]) => {
    setShowCalendar(false);
    setDates(d);
  };
  const getHeaderText = () => {
    if (dates.length === 0) return 'No days selected';

    const parts = [];
    const includesToday = dateExists(dates, today);
    const includesYesterday = dateExists(
      dates,
      new Date(dayjs(today).subtract(1, 'day').toDate())
    );

    const addYesterday =
      includesYesterday && (!includesToday || dates.length === 2);

    if (includesToday) parts.push('Today');
    if (addYesterday) parts.push('Yesterday');
    if (!(addYesterday && includesToday) && dates.length >= 1) {
      const subDays = 2 - (includesToday ? 1 : 0) - (addYesterday ? 1 : 0);
      const otherDayCount =
        includesToday || addYesterday ? dates.length - subDays : dates.length;
      if (otherDayCount)
        parts.push(`${otherDayCount} ${otherDayCount > 1 ? 'days' : 'day'}`);
    }
    return parts.join(' + ');
  };

  const handleFill = () => {
    setIsLoading(true)
    logger.log('Sending fill command to background service.', dates)
    chrome.runtime.sendMessage({action: 'fill', dates}, async (response) => {
      logger.log('Response from background service', response)
      setIsLoading(false)
    })
  }

  return (
    <div>
      {isLoading && <LoadingOverlay/>}
      <CalendarModal
        initialDates={dates}
        show={showCalendar}
        setShow={setShowCalendar}
        onSubmit={(dates) => handleCalendarSubmit(dates)}
      />
      <div className="m-4">
        <div className="flex gap-2 items-bottom">
          <p className="text-2xl font-bold pl-5 text-rose-400">
            {getHeaderText()}
          </p>
          <button className="text-xl" onClick={() => setShowCalendar(true)}>
            <FiCalendar />
          </button>
        </div>
        <div className="p-4 bg-stone-400/10 rounded-2xl">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit
          velit quasi rem, voluptas magni tenetur! Aliquid numquam quo dolores
          omnis voluptatibus ab itaque, nam dignissimos quod atque, error
          laudantium unde.
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 absolute bottom-0 bg-rose-400 w-full h-12">
        <ToolbarButton icon={<FiSliders className='text-2xl'/>} label="Presets" onClick={() => {}} />
        <button onClick={() => handleFill()} className="group grid place-content-center  hover:rounded-2xl rounded-[26px] transition-all duration-200 hover:border-[14px] border-[6px] border-stone-50 box-content bg-rose-600 w-12 h-12 mb-10 text-4xl text-stone-50">
          <FiPlus/>
          <span className="transition-all duration-200 flex group-hover:opacity-100 opacity-0 font-bold tracking-wide absolute mt-[18px] justify-center items-end text-stone-500 text-sm w-12 h-full">FILL</span>
        </button>
        <ToolbarButton icon={<FiSettings className='text-2xl'/>} label="Settings" onClick={() => {}} />
      </div>
    </div>
  );
};

export default Popup;
