let _context = ''

export const logger = {
  debug: (...args: any[]) => {
    console.debug(`TimeSheeteer🥷 ${_context}(DEBUG):`, ...args);
  },
  log: (...args: any[]) => {
    console.log(`TimeSheeteer🥷 ${_context}(LOG):`, ...args);
  },
  warn: (...args: any[]) => {
    console.warn(`TimeSheeteer🥷 ${_context}(WARN):`, ...args);
  },
  error: (...args: any[]) => {
    console.error(`TimeSheeteer🥷 ${_context}(ERROR):`, ...args);
  },
  setContext: (context: string) => _context = context,
}