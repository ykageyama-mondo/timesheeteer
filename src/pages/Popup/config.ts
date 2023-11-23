export const timeTypes = {
  'worked': 'Normal Time',
  'took a break': 'Break',
}

export const expandTimeTypes: Array<keyof typeof timeTypes> = ['worked']

export const timeOptions = Object.keys(timeTypes)

export const workTypes = {
  'CAPEX': 'CAPEX',
  'OPEX': 'OPEX',
}

export const workOptions =  Object.keys(workTypes)

export const localStorageKeys = {
  prevPage : 'prevPage',
}