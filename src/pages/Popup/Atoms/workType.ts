import {WorkType} from '@/models/timeRecord'
import {atom} from 'jotai'
import {workTypeKey} from '../config'

const defaultWorkTypeMap: Record<string, WorkType> = {
  'Cost Centre': {
    workType: 'None',
  },
  CAPEX: {
    workType: 'Network',
    workCode: '4009962_0020',
  },
};

const getWorkTypes = () => {
  const workTypes = localStorage.getItem(workTypeKey);
  if (!workTypes) return defaultWorkTypeMap;
  return JSON.parse(workTypes) as Record<string, WorkType>;
};

export const workTypeAtom = atom<Record<string, WorkType>>(
  getWorkTypes(),
);