import {useEffect, useState} from 'react'
import {logger} from '@/helpers/logger'
import {FiCalendar} from 'react-icons/fi'
import {CalendarModal} from './Calendar'
import {dateExists} from '@/helpers/date'
import dayjs from 'dayjs'
import {LoadingOverlay} from './LoadingOverlay'
import {RecordList} from './Record'
import {Footer} from './Footer'
import toast, {Toaster} from 'react-hot-toast'
import {RecordItem, ValidatedRecordItem} from '../Models'
import {TimeRecord, WorkType} from '@/models/timeRecord'
import {FieldErrors, FormProvider, useForm} from 'react-hook-form'
import {timeTypes, workTypes} from '../config'
const today = new Date()

const defaultWorkTypeMap: Record<string, WorkType> = {
  OPEX: {
    workType: 'None'
  },
  CAPEX: {
    workType: 'Network',
    workCode: '4009962_0020'
  },
}

const transformRecords = (records: ValidatedRecordItem[]): TimeRecord[] => {
  return records.map((record) => {
    const {from, to, timeType, workType} = record
    const startTime = `${from.hour}:${from.min}`
    const endTime = `${to.hour}:${to.min}`

    const timeTypeValue = (timeTypes as Record<string, string>)[timeType]
    const workTypeValue = (workTypes as Record<string, string>)[workType]

    const mappedWorkType = timeTypeValue === 'Break' ? {workType: 'None'} : defaultWorkTypeMap[workTypeValue]
    return {
      startTime,
      endTime,
      timeType: timeTypeValue,
      ...mappedWorkType
    } as TimeRecord
  })
}
interface FormData {records: RecordItem[]}

const pageHeaderMap: Record<string, string> = {
  'presets': 'Presets',
  'settings': 'Settings'
}

const Popup = () => {
  const [dates, setDates] = useState<Date[]>([today])
  const [showCalendar, setShowCalendar] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState('home')
  const methods = useForm<FormData>({
    defaultValues: localStorage.getItem('formData') ? JSON.parse(localStorage.getItem('formData')!) : {records: []},
    resetOptions: {
    }
  })
  const {handleSubmit, reset, watch} = methods

  // cache records in local storage
  useEffect(() => {
    const sub = watch((value) => {
      logger.log(value)
      localStorage.setItem('formData', JSON.stringify(value))
    })
    return () => {
      sub.unsubscribe()
    }
  }, [watch])

  const handleCalendarSubmit = (d: Date[]) => {
    setShowCalendar(false)
    setDates(d)
  }
  const getHeaderText = () => {
    if (currentPage !== 'home')
      return pageHeaderMap[currentPage] ?? 'Narnia'

    if (dates.length === 0) return 'No days selected'

    const parts = []
    const includesToday = dateExists(dates, today)
    const includesYesterday = dateExists(
      dates,
      new Date(dayjs(today).subtract(1, 'day').toDate())
    )

    const addYesterday =
      includesYesterday && (!includesToday || dates.length === 2)

    if (includesToday) parts.push('Today')
    if (addYesterday) parts.push('Yesterday')
    if (!(addYesterday && includesToday) && dates.length >= 1) {
      const subDays = 2 - (includesToday ? 1 : 0) - (addYesterday ? 1 : 0)
      const otherDayCount =
        includesToday || addYesterday ? dates.length - subDays : dates.length
      if (otherDayCount)
        parts.push(`${otherDayCount} ${otherDayCount > 1 ? 'days' : 'day'}`)
    }
    return parts.join(' + ')
  }

  const onFill = (formData: FormData) => {
    setIsLoading(true)
    const payload = transformRecords(formData.records as ValidatedRecordItem[])
    logger.log('Sending fill command to background service.', payload)

    chrome.runtime.sendMessage({action: 'fill', data: {records: payload}}, async (response) => {
      logger.log('Response from background service', response)
      setIsLoading(false)
    })
  }

  const onValidationFailure = (e: FieldErrors<FormData>) => {
    logger.log(e)
    if (e.root) {
      toast.error(e.root.message ?? 'Something went wrong. What did you do??? 🤔 Or is it just broken???')
      return
    }

    if (e.records?.root) {
      toast.error(e.records?.root.message ?? `There was an error with your records.`)
      return
    }

    if (e.records && e.records.length) {
      const [first] = [e.records]
      toast.error(first.message ?? `There was an error with your records. You probably missed a field or something.`)
      return
    }
  }

  const preventEnterKeySubmission = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (e.key === "Enter" && !["TEXTAREA"].includes(target.tagName) && target.tagName !== "BUTTON") {
      e.preventDefault();
    }
  };

  return (
    <div>
      {isLoading && <LoadingOverlay />}
      <CalendarModal
        initialDates={dates}
        show={showCalendar}
        setShow={setShowCalendar}
        onSubmit={(dates) => handleCalendarSubmit(dates)}
      />
      <Toaster position='bottom-center' containerStyle={{
        bottom: 75,
      }} toastOptions={{duration: 3000, }} />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onFill, onValidationFailure)} onKeyPress={preventEnterKeySubmission}>
          <div className="flex gap-2 mx-4 mt-4 items-bottom px-5">
            <p className=" text-2xl font-bold text-rose-400">
              {getHeaderText()}
            </p>
            <button type='button' tabIndex={-1} className="text-xl rounded-full hover:bg-stone-300 h-8 w-8 text-align-center grid place-content-center transition-all duration-300" onClick={() => setShowCalendar(true)}>
              <FiCalendar/>
            </button>
            <button type='button' tabIndex={-1} className='font-bold text-rose-300 hover:text-rose-400 hover:underline transition-all duration-100 text-sm ml-auto mt-auto' onClick={() => reset({records: []}, {keepDefaultValues: false,})}>clear</button>
          </div>
          <RecordList />
          <Footer setPage={setCurrentPage} page={currentPage}/>
        </form>
      </FormProvider>
    </div>
  )
}

export default Popup
