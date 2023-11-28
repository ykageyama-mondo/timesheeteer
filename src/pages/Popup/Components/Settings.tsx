import { useEffect, useState } from 'react';
import { Footer } from './Footer';
import { WorkType } from '@/models/timeRecord';
import React from 'react';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { WorkTypeDialog } from './Dialogs/WorkTypeDialog';
import { cn } from '@/helpers/cn';
import { useAtom } from 'jotai';
import { workTypeAtom } from '../Atoms';
import { workTypeKey } from '../config';

export const SettingsPage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [workTypes, setWorkTypes] = useAtom(workTypeAtom);

  useEffect(() => {
    localStorage.setItem(workTypeKey, JSON.stringify(workTypes));
  }, [workTypes]);

  const getWorkTypeString = (workType: WorkType) => {
    if (workType.workType === 'None') return 'Cost Centre';
    return `${workType.workType}:   ${workType.workCode}`;
  };

  const handleDelete = (name: string) => {
    const newWorkTypes = { ...workTypes };
    delete newWorkTypes[name];
    setWorkTypes(newWorkTypes);
  };

  const handleAddWorkType = (name: string, workType: WorkType) => {
    const newWorkTypes = { ...workTypes };
    newWorkTypes[name] = workType;
    setWorkTypes(newWorkTypes);
  };

  return (
    <div>
      <div className="flex gap-2 mx-4 mt-4 items-bottom px-5 justify-between">
        <p className="text-2xl font-bold text-rose-400">Settings</p>
      </div>
      <div>
        <div className="flex gap-2 mx-4 mt-4 items-bottom px-5 justify-between">
          <p className="text-lg font-bold">Work Types</p>
          <button
            className="ml-auto text-sm font-bold text-rose-300 hover:text-rose-400 hover:underline"
            onClick={() => setShowDialog(true)}
          >
            <div className="flex items-center">
              <FiPlus />
              <span>add</span>
            </div>
          </button>
        </div>
        <div className="gap-2 max-h-[540px] scrollbar-thin  scrollbar-thumb-rose-300 overflow-y-auto overflow-x-hidden mx-4 border-2 border-stone-200 rounded-lg">
          {Object.entries(workTypes).map(([name, workType]) => (
            <div
              className="justify-between items-center flex px-2 py-2 hover:bg-rose-100"
              key={name}
            >
              <div>
                <p className="text-lg  text-rose-400">{name}</p>
                <p className="text-sm text-rose-400 font-bold ">
                  {getWorkTypeString(workType)}
                </p>
              </div>
              <div>
                <button
                  disabled={name === 'Cost Centre'}
                  title={
                    name === 'Cost Centre'
                      ? "You probably don't want to do that"
                      : 'Remove'
                  }
                  className={cn(
                    'text-lg text-stone-400 ',
                    name === 'Cost Centre'
                      ? 'cursor-not-allowed text-stone-300'
                      : 'hover:text-rose-400'
                  )}
                  onClick={() => handleDelete(name)}
                >
                  <FiTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <WorkTypeDialog
        onSubmit={(name, workType) => handleAddWorkType(name, workType)}
        setShowDialog={setShowDialog}
        showDialog={showDialog}
      />
    </div>
  );
};
