import {Dialog} from '@/components/Dialog'
import {useState} from 'react'
import toast from 'react-hot-toast'

interface Props {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onSubmit: (name: string) => void;
}
export const PresetDialog: React.FC<Props> = ({
  showDialog,
  setShowDialog,
  onSubmit
}) => {

  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.length === 0) {
      toast.error('Name cannot be empty');
      return;
    };
    setShowDialog(false);
    onSubmit(name);
    setName('')
  }

  return (
    <Dialog
      title="Create Preset"
      show={showDialog}
      setShow={setShowDialog}
      onSubmit={handleSubmit}
    >
      <p className="pl-1 pb-1 text-stone-600">Name</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Give me a name!"
        type="text"
        className="text-md w-full border border-stone-200 bg-stone-100 focus:border-stone-300 focus:bg-stone-200/80 rounded-lg p-4 focus:outline-none"
      />
    </Dialog>
  );
};
