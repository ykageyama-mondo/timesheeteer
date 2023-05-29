import { logger } from '@/helpers/logger';
import React from 'react';

const recordBtnId =
  '__component1---timeRecordingView--attendancesClock--add-BDI-content';
const timeTypeSelectId = '__box0-inner';
const startTimeInputId = '__picker0-inner';
const endTimeInputId = '__picker1-inner';
const simulateMouseEvent = function (
  element: Element,
  ...eventNames: string[]
) {
  logger.debug(
    `Simulating mouse events ${eventNames} on element ${element.id}`
  );

  const box = element.getBoundingClientRect(),
    coordX = box.left + (box.right - box.left) / 2,
    coordY = box.top + (box.bottom - box.top) / 2;
  for (const eventName of eventNames) {
    element.dispatchEvent(
      new MouseEvent(eventName, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: coordX,
        clientY: coordY,
        button: 0,
      })
    );
  }
};

const getElement = async (
  selector: string,
  props: {parent?: HTMLElement | Document, maxRetries?: number} = {}
): Promise<HTMLElement> => {
  logger.debug(`Waiting for element ${selector}`);

  const parent = props.parent || document;
  const maxRetries = props.maxRetries || 10;
  let el = parent.querySelector<HTMLElement>(selector);
  let retries = 0;
  while (!el && retries < maxRetries) {
    el = parent.querySelector<HTMLElement>(selector);
    await new Promise((resolve) => setTimeout(resolve, 100));
    retries++;
  }
  if (!el) {
    throw new Error(`Element ${selector} not found`)
  }
  return el;
};

const getElements = async (
  selector: string,
  props: {parent?: HTMLElement | Document, maxRetries?: number} = {}
): Promise<NodeListOf<HTMLElement>> => {
  logger.debug(`Waiting for multiple ${selector} elements`);

  const parent = props.parent || document;
  const maxRetries = props.maxRetries || 10;
  let el = parent.querySelectorAll<HTMLElement>(selector);
  let retries = 0;
  while ((!el || !el.length) && retries < maxRetries) {
    el = parent.querySelectorAll<HTMLElement>(selector);
    await new Promise((resolve) => setTimeout(resolve, 100));
    retries++;
  }
  if (!el) {
    throw new Error(`Element ${selector} not found or empty`)
  }
  return el;
};


const waitForValue = async (
  element: HTMLSelectElement,
  desiredValue: string,
  maxRetries = 10
): Promise<boolean> => {
  logger.debug(`Waiting for value ${desiredValue} in element ${element.id}`);

  let retries = 0;
  while (element.value !== desiredValue && retries < maxRetries) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    retries++;
  }

  return element.value === desiredValue;
};

const handleClick = async () => {
  try {
    logger.debug('Fill button handler called');

    const btn = await getElement(`#${recordBtnId}`);

    simulateMouseEvent(btn, 'mousedown', 'click');

    const timeType = await getElement(`#${timeTypeSelectId}`);
    if (!timeType) {
      logger.error('Time type select not found');
      return;
    }
    const loaded = await waitForValue(
      timeType as HTMLSelectElement,
      'Normal Time',
      60
    );

    if (!loaded) {
      logger.error('Failed to load the time record in 30 seconds');
      return;
    }

    const startTimeElement = await getElement(`#${startTimeInputId}`);
    const endTimeElement = await getElement(`#${endTimeInputId}`);

    (startTimeElement as HTMLInputElement).value = '08:00';
    (endTimeElement as HTMLInputElement).value = '17:00';

    for (const ev of ['change', 'blur']) {
      startTimeElement.dispatchEvent(new Event(ev, { bubbles: true }));
    }
    for (const ev of ['change', 'blur'])
      endTimeElement.dispatchEvent(new Event(ev, { bubbles: true }));

    const networkButtonId = '__field1-inner-vhi';
    const networkButton = await getElement(`#${networkButtonId}`);

    simulateMouseEvent(networkButton, 'mousedown', 'click');
    const helpDialogId = '__help1-dialog';
    const helpDialog = await getElement(`#${helpDialogId}`);

    const table = await getElement('table', {parent: helpDialog})

    const rows = await getElements('tr', {parent: table})

    const networkRow = [...rows].find((row) =>
      row.innerHTML?.includes('Network')
    );
    if (!networkRow)
      throw new Error('Network row not found');

    simulateMouseEvent(networkRow, 'mousedown', 'click');

    const helpSubmitButtonId = '__help1-ok';

    const helpSubmitButton = await getElement(`#${helpSubmitButtonId}`);
    
    simulateMouseEvent(helpSubmitButton, 'mousedown', 'click');

    const networkCodeButtonId = '__field2-inner-vhi';
    const networkCodeButton = await getElement(`#${networkCodeButtonId}`, {maxRetries: 30});

    simulateMouseEvent(networkCodeButton, 'mousedown', 'click');

    const networkCodeDialogId = '__help2-dialog';
    const networkCodeDialog = await getElement(`#${networkCodeDialogId}`);

    const networkCodeSearch = await getElement('input', {parent: networkCodeDialog});

    (networkCodeSearch as HTMLInputElement).value = '4006852_0020';
    for (const ev of [
      'keydown',
      'keyup',
      'keypress',
      'change',
      'input',
      'focusout',
    ]) {
      networkCodeSearch.dispatchEvent(new Event(ev, { bubbles: true }));
    }
    const networkCodeTable = await getElement('table tbody', {parent: networkCodeDialog})

    let networkCodeRows = await getElements('tr', {parent: networkCodeTable})
    let ret = 0;
    while (
      ret < 30 &&
      (networkCodeRows.length > 5)
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      networkCodeRows = await getElements('tr', {parent: networkCodeTable})
      ret++;
    }

    if (networkCodeRows.length > 5)
      throw new Error('Too many rows found in network code table');

    simulateMouseEvent(networkCodeRows[0], 'mousedown', 'click');

    const networkCodeSubmitButtonId = '__help2-ok';
    const networkCodeSubmitButton = await getElement(
      `#${networkCodeSubmitButtonId}`
    );

    simulateMouseEvent(networkCodeSubmitButton, 'mousedown', 'click');
  } catch (error) {
    logger.error(error);
  }
};

const FillButton: React.FC = () => {
  return (
    <div className="ml-2">
      <button
        onClick={handleClick}
        className="px-4 py-2 font-semibold text-sm bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-sm"
      >
        Auto Fill
      </button>
    </div>
  );
};

export default FillButton;
