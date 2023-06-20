export type TimeRecord = {
  startTime: string;
  endTime: string;
  timeType: 'Normal Time' | 'Break';
} & WorkType

export type WorkType = ({
  workType: 'Network' | 'Cost Centre';
  workCode: string;
} | {
  workType: 'None';
});