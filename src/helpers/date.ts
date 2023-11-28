import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

export const dateExists = (dates: Date[], date: Date) =>
  dates.some((d) => dayjs(date).isSame(dayjs(d), 'day'));
export const datesExcept = (dates: Date[], date: Date) =>
  dates.filter((d) => !dayjs(date).isSame(dayjs(d), 'day'));
export const datesInSingleWeek = (dates: Date[]) =>
  new Set(dates.map(d => dayjs(d).week())).size === 1;
export const formatDate = (date: Date) => dayjs(date).format('DD MMM');
export const getWeekDay = (date: Date) => dayjs(date).format('dddd');