import { logger } from '@/helpers/logger';
import { Preset } from '../Models';
import { useState } from 'react';
import { v4 as generateUuid } from 'uuid';
import {Footer} from './Footer'

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
      ],
    };
  };

  return (
    <div>
      <button onClick={() => onAddPreset(genRandomPreset())}>Add preset</button>
      <div>{JSON.stringify(presets, null, 2)}</div>
      <Footer/>
    </div>
  );
};
