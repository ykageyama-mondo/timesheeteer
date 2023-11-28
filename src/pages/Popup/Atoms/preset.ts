import {atom} from 'jotai'
import {Preset} from '../Models'
import {presetKeyPrefix} from '../config'
import {logger} from '@/helpers/logger'

const getPresets = (): Record<string, Preset> => {
  const presets: Record<string, Preset> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith(presetKeyPrefix)) continue;
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

export const presetAtom = atom<Record<string, Preset>>(getPresets())
