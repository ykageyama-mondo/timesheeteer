import {TimeRecord} from '@/models/timeRecord'

export const preset: TimeRecord[] = [
  {
    startTime: '09:00',
    endTime: '12:00',
    timeType: 'Normal Time',
    workType: 'Network',
    workCode: '4009962_0020',
  },
  {
    startTime: '12:00',
    endTime: '13:00',
    timeType: 'Break',
    workType: 'None',
  },
  {
    startTime: '13:00',
    endTime: '14:30',
    timeType: 'Normal Time',
    workType: 'None',
  },
  {
    startTime: '14:30',
    endTime: '16:30',
    timeType: 'Normal Time',
    workType: 'Network',
    workCode: '4009962_0020',
  },
  {
    startTime: '16:30',
    endTime: '17:00',
    timeType: 'Normal Time',
    workType: 'None',
  },
  {
    startTime: '17:00',
    endTime: '17:30',
    timeType: 'Normal Time',
    workType: 'Network',
    workCode: '4009962_0020',
  },
];
