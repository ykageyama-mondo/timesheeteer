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

const keyPrefix = 'presets-';

const getPresets = (): Record<string, Preset> => {
  const presets: Record<string, Preset> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith(keyPrefix)) continue;
    const item = localStorage.getItem(k);
    if (!item) continue;
    try {
      const parsed = JSON.parse(item);
      presets[k] = parsed;
    } catch (error) {
      logger.error('Failed to parse preset. Removing preset with key', k);
      localStorage.removeItem(k);
    }
  }
  return presets;
};

const addPreset = (preset: Preset) => {
  const key = `${keyPrefix}${generateUuid()}`;
  localStorage.setItem(key, JSON.stringify(preset));
  return key;
};

export const PresetPage: React.FC = () => {
  const [presets, setPresets] = useState<Record<string, Preset>>(() =>
    getPresets()
  );

  const onAddPreset = (preset: Preset) => {
    const k = addPreset(preset);
    setPresets({ ...presets, [k]: preset });
  };

  const genRandomPreset = (): Preset => {
    return {
      name: 'Random Preset',
      records: [
        {
          from: {
            hour: Math.floor(Math.random() * 12).toString(),
            min: Math.floor(Math.random() * 60).toString(),
          },
          to: {
            hour: Math.floor(Math.random() * 12 + 12).toString(),
            min: Math.floor(Math.random() * 60).toString(),
          },
          timeType: 'Break',
        },
        {
          from: {
            hour: Math.floor(Math.random() * 12).toString(),
            min: Math.floor(Math.random() * 60).toString(),
          },
          to: {
            hour: Math.floor(Math.random() * 12 + 12).toString(),
            min: Math.floor(Math.random() * 60).toString(),
          },
          timeType: 'Work',
          workType: 'Coding'
        },
      ],
    };
  };

  return (
    <div>
      <button onClick={() => onAddPreset(genRandomPreset())}>Add preset</button>
      <div className="pb-12 max-h-[540px] scrollbar-thin scrollbar-thumb-rose-300 overflow-auto flex flex-col gap-1 p-2">
        {Object.entries(presets).map(([id, p]) => (
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
}> = ({ preset, onDelete, onEdit }) => {
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

  return (
    <div className="p-4 border rounded shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="text-md font-bold zinc-700">{preset.name}</p>
          <button
            onClick={() => setShowBreakdown((bd) =>!bd)}
            title="Click for time breakdown"
            className="items-center text-xl text-rose-400 hover:text-rose-600 flex gap-2"
          >
            {formatMinutes(summary.durationMins)}
            <FiChevronsDown />
          </button>
        </div>
        <div className="flex gap-2 text-lg transition-colors duration-150">
          <button
            title="Edit"
            className="text-zinc-400 hover:text-orange-500"
            onClick={() => onEdit()}
          >
            <FiEdit />
          </button>
          <button
            title="Remove"
            className="text-zinc-400 hover:text-red-600"
            onClick={() => onDelete()}
          >
            <FiTrash />
          </button>
        </div>
      </div>
      <div className={"grid grid-cols-2 gap-1 w-1/2 transition-transform " + showBreakdown ? 'h-100' : 'h-0'}>
        {Object.entries(summary.breakdown).map(([name, durationMins]) => (
          <>
            <p className='text-zinc-600'>{name}</p>
            <p>{formatMinutes(durationMins)}</p>
          </>
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
