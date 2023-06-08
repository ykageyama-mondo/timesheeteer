import { FaPlus } from 'react-icons/fa';

export const Record = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="p-4 bg-stone-400/10 rounded-2xl">Record</div>
      <button className="group gap-2 w-full flex justify-center items-center bg-rose-200 hover:bg-rose-300 transition-all duration-300 hover:ring ring-rose-200 hover:font-bold p-4 rounded-full mt-2 text-base">
        <FaPlus className=" w-5 h-5 text-rose-500 group-hover:text-rose-700 transition-colors duration-300" />
        <span>Record Time</span>
      </button>
    </div>
  );
};
