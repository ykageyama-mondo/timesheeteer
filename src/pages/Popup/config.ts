export const timeTypes = {
  'worked': 'Normal Time',
  'took a break': 'Break',
}

export const expandTimeTypes: Array<keyof typeof timeTypes> = ['worked']

export const timeOptions = Object.keys(timeTypes)

export const localStorageKeys = {
  prevPage : 'prevPage',
}

export const presetKeyPrefix = 'presets-';
export const workTypeKey = 'workType';
