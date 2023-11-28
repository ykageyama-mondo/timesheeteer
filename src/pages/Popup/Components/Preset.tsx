import { logger } from '@/helpers/logger';
import { Preset } from '../Models';
import { useMemo, useState } from 'react';
import { v4 as generateUuid } from 'uuid';
import { Footer } from './Footer';
import {
  FiChevronsDown,
  FiEdit,
  FiTrash,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import {cn} from '@/helpers/cn'
import React from 'react'
import {useAtom} from 'jotai'
import {presetAtom} from '../Atoms'

interface PresetPageProps {
  onApply: (preset: Preset) => void;
}
export const PresetPage: React.FC<PresetPageProps> = ({onApply}) => {
  const  [presets, setPresets] = useAtom(presetAtom)

  return (
    <div>
      <div className="flex gap-2 mx-4 mt-4 items-bottom px-5 justify-between">
        <p className="text-2xl font-bold text-rose-400">
          Presets
        </p>
      </div>

      <div className="pb-12 max-h-[540px] scrollbar-thin scrollbar-thumb-rose-300 overflow-auto flex flex-col gap-1 p-2">
        {Object.keys(presets).length === 0 ? <p className='bg-stone-200 px-4 py-4 rounded-lg '>No presets</p> :Object.entries(presets).map(([id, p]) => (
          <PresetItem
            key={id}
            preset={p}
            onDelete={() => {
              localStorage.removeItem(id);
              const newPresets = { ...presets };
              delete newPresets[id];
              setPresets(newPresets);
              toast.success(`Removed preset ${p.name}`);
            }}
            onEdit={() => {
              toast.error('Not implemented');
            }}
            onApply={() => {
              onApply(p)
            }}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};
interface PresetSummary {
  recordCount: number;
  durationMins: number;
  breakdown: {
    /**
     * Mapping from work type name to allocated duration mins
     */
    [workName: string]: number;
  };
}

const PresetItem: React.FC<{
  preset: Preset;
  onEdit: () => void;
  onDelete: () => void;
  onApply: () => void;
}> = ({ preset, onDelete, onEdit, onApply }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const summary = useMemo<PresetSummary>(() => {
    const sum = preset.records.reduce(
      (agg: Omit<PresetSummary, 'recordCount'>, r) => {
        const { from, to, timeType, workType } = r;

        const diffHour = parseInt(to.hour) - parseInt(from.hour);
        const diffMin = (60 + (parseInt(to.min) - parseInt(from.min))) % 60;
        const durationMins = diffHour * 60 + diffMin;
        agg.durationMins += durationMins;

        const name =
          timeType === 'Break' ? timeType : workType || 'Something is broke';
        agg.breakdown[name] = (agg.breakdown[name] ?? 0) + durationMins;
        return agg;
      },
      {
        breakdown: {},
        durationMins: 0,
      }
    );
    return {
      ...sum,
      recordCount: preset.records.length,
    };
  }, [preset]);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  }

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit();
  }

  const applyPreset = () => {
    logger.log('Applying preset');
    onApply()
  }

  return (
    <div title='Click to apply preset' className="cursor-pointer hover:bg-rose-50 hover:border-rose-200 p-4 border-stone-300 border rounded-lg shadow-md" onClick={applyPreset}>
      <div className="flex justify-between">
        <div>
          <p className="text-md font-bold stone-700">{preset.name}</p>
          <button
            onClick={(e) => {e.stopPropagation(); setShowBreakdown((bd) =>!bd)}}
            title="Click for time breakdown"
            className="items-center text-xl text-rose-400 hover:text-rose-600 flex gap-2 focus:outline-none"
          >
            {formatMinutes(summary.durationMins)}
            <FiChevronsDown className={cn('transition-all duration-100', showBreakdown && 'rotate-180')}/>
          </button>
        </div>
        <div className="flex gap-2 text-lg transition-colors duration-150">
          <button
            title="Edit"
            className="text-stone-400 hover:text-orange-500"
            onClick={(e) => handleEdit(e)}
          >
            <FiEdit />
          </button>
          <button
            title="Remove"
            className="text-stone-400 hover:text-red-600"
            onClick={(e) => handleDelete(e)}
          >
            <FiTrash />
          </button>
        </div>
      </div>
      <div className={cn("grid grid-cols-2 gap-1 w-1/2 transition-[all] duration-200 ", showBreakdown ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0')}>
        {Object.entries(summary.breakdown).map(([name, durationMins], i) => (
          <React.Fragment key={i}>
            <p className='text-stone-600'>{name}</p>
            <p>{formatMinutes(durationMins)}</p>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};
