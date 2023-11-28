import { Dialog } from '@/components/Dialog';
import {WorkType} from '@/models/timeRecord'
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onSubmit: (name: string, workType: WorkType) => void;
}
export const WorkTypeDialog: React.FC<Props> = ({
  showDialog,
  setShowDialog,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [networkCode, setNetworkCode] = useState('');
  const handleSubmit = () => {
    if (name.length === 0) {
      toast.error('Name cannot be empty', );
      return;
    }
    if (networkCode.length === 0) {
      toast.length > 0 && toast.dismiss();
      toast.error('Network code cannot be empty');
      return;
    }

    setShowDialog(false);
    onSubmit(name, {
      workType: 'Network',
      workCode: networkCode,
    });
    setName('');
  };

  return (
    <Dialog
      title="Create Preset"
      show={showDialog}
      setShow={setShowDialog}
      onSubmit={handleSubmit}
    >
      <div className='flex flex-col gap-2'>
        <div>
          <p className="pl-1 pb-1 text-stone-600">Name</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Give me a name!"
            type="text"
            className="text-md w-full border border-stone-200 bg-stone-100 focus:border-stone-300 focus:bg-stone-200/80 rounded-lg p-4 focus:outline-none"
          />
        </div>
        <div className='opacity-50'>
          <p className="pl-1 pb-1 text-stone-600">Work Type</p>
          <input
            title='Only network is supported for now'
            disabled
            value={'Network'}
            placeholder="Network"
            type="text"
            className="text-md w-full border border-stone-200 bg-stone-100 focus:border-stone-300 focus:bg-stone-200/80 rounded-lg p-4 focus:outline-none"
          ></input>
        </div>
        <div>
          <p className="pl-1 pb-1 text-stone-600">Network Code</p>
          <input
            value={networkCode}
            onChange={(e) => setNetworkCode(e.target.value)}
            placeholder="Time to look at your sticky note!"
            type="text"
            className="text-md w-full border border-stone-200 bg-stone-100 focus:border-stone-300 focus:bg-stone-200/80 rounded-lg p-4 focus:outline-none"
          />
        </div>
      </div>
    </Dialog>
  );
};
