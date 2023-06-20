import { FiSettings, FiSliders } from 'react-icons/fi';
import { FaFillDrip } from 'react-icons/fa';
const ToolbarButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button tabIndex={-1} onClick={onClick} type='button'>
      <div className="text-stone-200 hover:text-stone-100 hover:bg-rose-300 rounded p-1 w-12 flex flex-col justify-center items-center">
        {icon}
        <span className="text-[0.6rem]">{label}</span>
      </div>
    </button>
  );
};

interface FooterProps {
  page: string,
  setPage: (newPage: string) => void
}

export const Footer: React.FC<FooterProps> = ({
  page,
  setPage
}) => {
  return (
    <div className="flex items-center justify-center gap-6 absolute bottom-0 bg-rose-400 w-full h-12">
      <ToolbarButton
        icon={<FiSliders className="text-2xl" />}
        label="Presets"
        onClick={() => setPage('presets')}
      />
      <button
        type="submit"
        tabIndex={-1}
        className="subpixel-antialiased group grid place-content-center hover:rounded-[20px] rounded-[26px] transition-all duration-200 hover:border-[10px] border-[3px] border-stone-50 box-content hover:bg-rose-500 bg-rose-600 ring-2 ring-rose-600 w-10 h-10 hover:w-12 hover:h-12 mb-10 text-4xl text-stone-50"
      >
        <span className="transition-all duration-100 group-hover:opacity-100 opacity-0 font-bold tracking-wide absolute text-2xs w-10 group-hover:w-12 h-full mt-9">
          FILL
        </span>
        <FaFillDrip className="w-6 h-6 transition-all duration-200 group-hover:opacity-100 opacity-0" />
      </button>
      <ToolbarButton
        icon={<FiSettings className="text-2xl" />}
        label="Settings"
        onClick={() => setPage('settings')}
      />
    </div>
  );
};
