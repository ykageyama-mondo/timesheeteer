import {cn} from '@/helpers/cn'

export interface DialogProps {
  title: string;
  onSubmit: () => void;
  show: boolean;
  setShow: (show: boolean) => void;
}
export const Dialog: React.FC<DialogProps> = ({
  onSubmit,
  show,
  setShow,
  title,
  children
}) => {

  return (
    <div onClick={() => setShow(false)} className={cn("font-md bg-stone-900/20 backdrop-blur-[2px] fixed min-h-full min-w-full top-0 left-0 z-50", show ? 'visible' : 'hidden')}>
      <div onClick={(e) => e.stopPropagation()} className="rounded-lg bg-stone-50 min-w-[250px] min-h-[100px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute">
        <div className="px-4 py-2">
          <p className="text-2xl font-bold text-rose-400">{title}</p>
        </div>

        <div className="mx-4 my-2">{children}</div>
        <div className="py-2 flex divide-x-2 gap-1 justify-between">
          <button onClick={() => setShow(false)} className="flex-grow px-4 py-2 hover:drop-shadow-[0_0_0_black]">
            Cancel
          </button>
          <button className="flex-grow px-4 py-2 font-bold  text-rose-600 hover:text-rose-400" onClick={onSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};
