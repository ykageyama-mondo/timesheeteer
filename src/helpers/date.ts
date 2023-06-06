import dayjs from 'dayjs'

export const dateExists = (dates: Date[], date: Date) =>
  dates.some((d) => dayjs(date).isSame(dayjs(d), 'day'));
export const datesExcept = (dates: Date[], date: Date) =>
  dates.filter((d) => !dayjs(date).isSame(dayjs(d), 'day'));
