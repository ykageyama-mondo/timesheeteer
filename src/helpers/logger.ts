export const logger = {
  debug: (...args: any[]) => {
    console.debug('TimeSheeteer🥷 (DEBUG):', ...args);
  },
  log: (...args: any[]) => {
    console.log('TimeSheeteer🥷 (LOG):', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('TimeSheeteer🥷 (WARN):', ...args);
  },
  error: (...args: any[]) => {
    console.error('TimeSheeteer🥷 (ERROR):', ...args);
  },
}