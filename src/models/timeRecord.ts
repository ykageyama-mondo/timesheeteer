export type TimeRecord = {
  startTime: string;
  endTime: string;
  timeType: 'Normal Time' | 'Break';

} & ({
  workType: 'Network' | 'Cost Centre';
  workCode: string;
} | {
  workType: 'None';
});