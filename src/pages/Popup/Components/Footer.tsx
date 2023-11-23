import { FiHome, FiSettings, FiSliders } from 'react-icons/fi';
import {useAtom} from 'jotai'
import {pageAtom} from '../Atoms'
import {localStorageKeys} from '../config'
import {useEffect} from 'react'
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
      <div className="group text-stone-100 hover:text-stone-100 hover:bg-rose-400 rounded p-1 w-12 flex flex-col justify-center items-center">
        {icon}
        <span className="group-hover:font-bold text-[0.7rem]">{label}</span>
      </div>
    </button>
  );
};

export const Footer = () => {
  const [page, setPage] = useAtom(pageAtom)

  useEffect(() => {
    localStorage.setItem(localStorageKeys.prevPage, page)
  }, [page, setPage])

  return (
    <div className="rounded-t-xl flex items-center justify-center gap-4 absolute bottom-0 bg-rose-500 w-full h-12">
      <ToolbarButton
        icon={<FiHome className="text-2xl" />}
        label="Home"
        onClick={() => setPage('home')}
      />
      <ToolbarButton
        icon={<FiSliders className="text-2xl" />}
        label="Presets"
        onClick={() => setPage('presets')}
      />
      <ToolbarButton
        icon={<FiSettings className="text-2xl" />}
        label="Settings"
        onClick={() => setPage('settings')}
      />
    </div>
  );
};
