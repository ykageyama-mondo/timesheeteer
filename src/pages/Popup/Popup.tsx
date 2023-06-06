import {useEffect, useState} from 'react';
import './Popup.css';
import {logger} from '@/helpers/logger'
import {FiCalendar, FiPlus} from 'react-icons/fi'
import {CalendarModal} from './Calendar'
import {dateExists} from '@/helpers/date'
import dayjs from 'dayjs'

const timeOptions = [{
  label: 'worked',
  value: 'Normal Time'
}, {
  label: 'took a break',
  value: 'Break'
}]

const today = new Date()

const Popup = () => {
  const [test, setTest] = useState('')
  const [dates, setDates] = useState<Date[]>([today])
  const [showCalendar, setShowCalendar] = useState(false)


  useEffect(() => {
    chrome.storage.local.get(['test']).then((result) => {
      logger.log('Getting test', result)
      setTest(result.test)
    })
  }, [])

  const handleCalendarSubmit = (d: Date[]) => {
    setShowCalendar(false)
    setDates(d)
  }
  const getHeaderText = () => {
    if (dates.length === 0) return 'No days selected'

    const parts = []
    const includesToday = dateExists(dates, today)
    const includesYesterday = dateExists(dates, new Date(dayjs(today).subtract(1, 'day').toDate()))

    const addYesterday = includesYesterday && (!includesToday || dates.length === 2)

    if (includesToday) parts.push('Today')
    if (addYesterday) parts.push('Yesterday')
    if (!(addYesterday && includesToday) && dates.length >= 1) {
      const subDays = 2 - (includesToday ? 1 : 0) - (addYesterday ? 1 : 0)
      const otherDayCount = includesToday || addYesterday ? dates.length - subDays : dates.length
      if (otherDayCount)
        parts.push(`${otherDayCount} ${otherDayCount > 1 ? 'days' : 'day'}`)
    }
    return parts.join(' + ')
  }

  return (
    <div>
      <CalendarModal initialDates={dates} show={showCalendar} setShow={setShowCalendar} onSubmit={(dates) => handleCalendarSubmit(dates)}/>
      <div className='m-4'>
        <div className='flex gap-2 items-bottom'>
          <p className="text-2xl font-bold pl-5 text-rose-400">{getHeaderText()}</p>
          <button className='text-xl' onClick={() => setShowCalendar(true)}><FiCalendar/></button>
        </div>
      <div className="p-4 bg-stone-400/10 rounded-2xl">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit velit quasi rem, voluptas magni tenetur! Aliquid numquam quo dolores omnis voluptatibus ab itaque, nam dignissimos quod atque, error laudantium unde.</div>
      </div>
      <div className="flex items-center justify-center absolute bottom-0 bg-rose-400 w-full h-10">
        <button></button>
        <button className='hover:rounded-2xl rounded-[25px] transition-all duration-200 hover:border-[12px] border-[6px] border-stone-50 box-content bg-rose-600 w-12 h-12 mb-10 text-4xl text-stone-50'>+</button>
        <button></button>

      </div>
    </div>
  );
};

export default Popup;
