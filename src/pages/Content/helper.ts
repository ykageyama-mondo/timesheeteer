import {getWeekDay} from '@/helpers/date'
import { delay } from '@/helpers/delay';
import {
  getElements,
  getElement,
  simulateMouseEvent,
  waitForValue,
  simulateKeyboardEvent,
  waitForInnerHtml,
} from '@/helpers/element';
import { logger } from '@/helpers/logger';
import { retryUntilTrue } from '@/helpers/retry';
import { TimeRecord } from '@/models/timeRecord';

export const executeFill = async ({records, dates}: {records: TimeRecord[], dates: Date[]}) => {
  logger.debug('Fill button handler called');
  for (const date of dates) {
    try {
      await selectDay(date);
      await fillDay(records);
      await save();
    } catch (error) {
      logger.error('Error filling day', error);
      throw error;
    }
  }
};

const sapQueries = {
  dialog: 'section.sapMDialogSection',
  attendanceList: 'ul.sapMListItems.sapMListUl[id*="attendancesClock"]',
  recordButton: 'button[id*="attendancesClock--add"]',
  sectionHeaders: 'div.sapUiFormElementLbl.sapUiRespGridBreak',
  saveButton: 'button[id*="btnSaveTimeRecords"]',
  cancelButton: 'button[id*="btnCancelTimeRecords"]',
  loadingOverlay: '#sap-ui-blocklayer-popup',
  dayListSection: 'section[id*="daysListSection"]',
  selectedDay: 'span[id*="titleDate-inner"]'
} as const;

const selectDay = async (date: Date) => {
  const dayName = getWeekDay(date)
  const section = await getElement(sapQueries.dayListSection)
  const table = await getElement('table', {parent: section})
  const rows = await getElements('tr', {parent: table})
  const dayRow = [...rows].find(row => row.innerHTML?.includes(dayName))
  if (!dayRow) throw new Error('Day row not found')
  await simulateMouseEvent(dayRow)
  const selectedDay = await getElement(sapQueries.selectedDay)
  await waitForInnerHtml(selectedDay, dayName.slice(0, 3), {exact: false})
}

const fillDay = async (records: TimeRecord[], numRetries = 2) => {
  try {
    for (const [index, record] of records.entries()) {
      await clickRecordButton();
      const recordLi = await getRelevantAttendanceListItem(index);
      await simulateMouseEvent(recordLi);
      let sections = await getSections({ parent: recordLi });
      await fillTimeType(sections, record.timeType);
      await fillDuration(sections, record.startTime, record.endTime);
      if (record.workType !== 'None') {
        await fillWorkType(sections, record.workType);
        sections = await getSections({
          parent: recordLi,
          includeWorkCode: true,
        });
        await fillWorkCode(sections, record.workCode);
      }
      await delay(500);
      if (index % 2 === 1) {
        await collapseSections(index);
      }
    }
  } catch (error) {
    logger.error(error);
    if (numRetries > 0) {
      logger.log(
        `Critical Failure during day record fill. Retrying ${numRetries} more times`
      );
      await cancel();
      await fillDay(records, numRetries - 1);
    } else {
      throw error;
    }
  }
  return true;
};

async function getSections(props: {
  parent?: Element;
  includeWorkCode?: boolean;
}) {
  logger.debug('Getting sections');
  const includeWorkCode = props.includeWorkCode ?? false;

  const sectionHeaders = await getElements(sapQueries.sectionHeaders, {
    expectedLength: includeWorkCode ? 6 : 5,
    maxRetries: 100,
    parent: props.parent,
  });
  const sections: any[] = [];
  sectionHeaders.forEach((v) => sections.push(v.nextElementSibling));
  const [
    timeType,
    startTime,
    endTime,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _duration,
    workType,
    workCode,
  ] = sections;
  return {
    timeType,
    startTime,
    endTime,
    workType,
    workCode,
  };
}

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type Sections = UnwrapPromise<ReturnType<typeof getSections>>;

const clickRecordButton = async () => {
  logger.debug('Clicking record button');
  const recordBtn = await getElement(sapQueries.recordButton, {
    maxRetries: 100,
  });
  await simulateMouseEvent(recordBtn);
};

const getRelevantAttendanceListItem = async (index: number) => {
  logger.debug('Getting relevant attendance list item');
  const attendanceList = await getElement(sapQueries.attendanceList, {
    maxRetries: 100,
  });
  await retryUntilTrue(
    100,
    async () =>
      attendanceList.querySelectorAll('li[tabindex="-1"]').length === index + 1
  );
  return attendanceList.children[0];
};

export const fillTimeType = async (sections: Sections, timeType: string) => {
  logger.debug('Filling time type');
  const timeTypeInput = await getElement<HTMLInputElement>(`input`, {
    parent: sections.timeType,
  });
  await waitForValue(timeTypeInput, 'Normal Time', {
    maxRetries: 60,
  });
  timeTypeInput.value = timeType;
  for (const ev of ['focus', 'input']) {
    timeTypeInput.dispatchEvent(new Event(ev, { bubbles: true }));
  }
  timeTypeInput.dispatchEvent(
    new KeyboardEvent('keydown', {
      code: 'Enter',
      key: 'Enter',
      charCode: 13,
      keyCode: 13,
      view: window,
      bubbles: true,
    })
  );
};

const fillDuration = async (
  sections: Sections,
  startTime: string,
  endTime: string
) => {
  logger.debug('Filling duration');
  const startTimeElement = await getElement<HTMLInputElement>('input', {
    parent: sections.startTime,
  });
  const endTimeElement = await getElement<HTMLInputElement>('input', {
    parent: sections.endTime,
  });

  startTimeElement.value = startTime;
  endTimeElement.value = endTime;

  for (const ev of ['change', 'blur']) {
    startTimeElement.dispatchEvent(new Event(ev, { bubbles: true }));
  }
  for (const ev of ['change', 'blur'])
    endTimeElement.dispatchEvent(new Event(ev, { bubbles: true }));
};

const fillWorkType = async (sections: Sections, workType: string) => {
  logger.debug('Filling work type');
  const workTypeButton = await getElement('span', {
    parent: sections.workType,
  });

  await simulateMouseEvent(workTypeButton);
  const workTypeDialog = await getElement(sapQueries.dialog);

  const table = await getElement('table', { parent: workTypeDialog });

  const rows = await getElements('tr', {
    parent: table,
    expectedLength: 3,
  });

  const workTypeRow = [...rows].find((row) =>
    row.innerHTML?.includes(workType)
  );
  if (!workTypeRow) throw new Error(`${workType} row not found`);
  await delay(250)
  await simulateMouseEvent(workTypeRow);

  await retryUntilTrue(100, async () => {
    try {
      const el = await getElement(sapQueries.dialog, { maxRetries: 1 });
      // eslint-disable-next-line eqeqeq
      return el == undefined;
    } catch (error) {
      return true;
    }
  });
};

const fillWorkCode = async (sections: Sections, workCode: string) => {
  logger.debug('Filling work code');
  const workCodeButton = await getElement('span', {
    maxRetries: 30,
    parent: sections.workCode,
  });

  await simulateMouseEvent(workCodeButton);
  const workCodeDialog = await getElement(sapQueries.dialog);

  const workCodeSearch = await getElement('input', {
    parent: workCodeDialog,
  });

  (workCodeSearch as HTMLInputElement).value = workCode;
  await delay(250)
  await simulateKeyboardEvent(workCodeSearch, 'Enter')
  const workCodeTable = await getElement('table tbody', {
    parent: workCodeDialog,
  });

  let workCodeRows = await getElements('tr', { parent: workCodeTable });
  let retries = 0;
  while (retries < 30 && workCodeRows.length > 1) {
    await delay(100);
    workCodeRows = await getElements('tr', { parent: workCodeTable });
    retries++;
  }
  if (workCodeRows.length > 1)
    throw new Error('Too many rows found in work code table');

  await simulateMouseEvent(workCodeRows[0]);
};

const save = async () => {
  logger.debug('Saving');
  const saveButton = await getElement(sapQueries.saveButton);
  await simulateMouseEvent(saveButton.children[0]);

  const loadingOverlay = await getElement(sapQueries.loadingOverlay);

  await retryUntilTrue(1000, async () => {
    return loadingOverlay.style.display === 'none';
  });
};

const cancel = async () => {
  logger.debug('Cancelling');
  const cancelButton = await getElement(sapQueries.cancelButton);
  await simulateMouseEvent(cancelButton.children[0]);

  const loadingOverlay = await getElement(sapQueries.loadingOverlay);

  await retryUntilTrue(1000, async () => {
    return loadingOverlay.style.display === 'none';
  });

  await delay(5000);
};

const collapseSections = async (index: number) => {
  logger.debug('Collapsing sections');
  const attendanceList = await getElement(sapQueries.attendanceList, {
    maxRetries: 100,
  });
  await retryUntilTrue(
    100,
    async () => attendanceList.children.length === index + 1
  );

  for (const li of attendanceList.children) {
    try {
      const collapseButton = await getElement(
        'button[aria-label="Expand/Collapse"][aria-expanded="true"]',
        { parent: li, maxRetries: 2 }
      );
      await simulateMouseEvent(collapseButton);
    } catch (error) {
      logger.debug('Record already collapsed');
    }
  }

  return attendanceList.children[0];
};
