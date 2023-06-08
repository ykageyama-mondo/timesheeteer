import { useState } from 'react';
import { logger } from '@/helpers/logger';
import { FiCalendar } from 'react-icons/fi';
import { CalendarModal } from './Calendar';
import { dateExists } from '@/helpers/date';
import dayjs from 'dayjs';
import {LoadingOverlay} from './LoadingOverlay'
import {RecordList} from './Record'
import {Footer} from './Footer'
const today = new Date();



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

  const onFill = () => {
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
      <div>
        <div className="flex gap-2 items-bottom mx-4 mt-4">
          <p className="text-2xl font-bold pl-5 text-rose-400">
            {getHeaderText()}
          </p>
          <button tabIndex={-1} className="text-xl" onClick={() => setShowCalendar(true)}>
            <FiCalendar />
          </button>
        </div>
        <RecordList/>
      </div>
      <Footer handleFill={onFill}/>
    </div>
  );
};

export default Popup;
