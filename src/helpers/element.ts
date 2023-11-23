import {delay} from './delay'
import {logger} from './logger'

export const simulateMouseEvent = async (
  element: Element,
) => {
  logger.debug(
    `Simulating mouse events on element ${element.id}`
  );
  logger.debug(`Scrolling element ${element.id} into view`)
  await new Promise<void>(resolve => {
    chrome.runtime.sendMessage({
        action: 'scrollIntoView', 
        data: {el: `${element.id ? `#${element.id}` : ''}.${element.className.split(' ').join('.')}`}
      },
       () => {
        resolve()
      }
    )
  })
  const box = element.getBoundingClientRect(),
  coordX = box.left + (box.right - box.left) / 2,
  coordY = box.top + (box.bottom - box.top) / 2;
  logger.debug(`Clicking element ${element.id} at ${coordX}, ${coordY}`)
  await new Promise<void>(resolve => chrome.runtime.sendMessage({
      action: 'click',
      data: {coordX, coordY}
    },
    () => resolve()
  ))
};

export const getElement = async <T extends Element = HTMLElement>(
  selector: string,
  props: { parent?: Element | Document; maxRetries?: number } = {}
): Promise<T> => {
  logger.debug(`Waiting for element ${selector}`);

  const parent = props.parent || document;
  const maxRetries = props.maxRetries || 30;
  let el = parent.querySelector<T>(selector);
  let retries = 0;
  while (!el && retries < maxRetries) {
    el = parent.querySelector<T>(selector);
    await delay(100);
    retries++;
  }
  if (!el) {
    throw new Error(`Element ${selector} not found`);
  }
  return el;
};

export const getElements = async (
  selector: string,
  props: {
    parent?: Element | Document;
    maxRetries?: number;
    expectedLength?: number;
  } = {}
): Promise<NodeListOf<HTMLElement>> => {
  logger.debug(`Waiting for multiple ${selector} elements`);
  const expectedLength = props.expectedLength || 1;
  const parent = props.parent || document;
  const maxRetries = props.maxRetries || 10;
  let el = parent.querySelectorAll<HTMLElement>(selector);
  let retries = 0;
  while ((!el || el.length < expectedLength) && retries < maxRetries) {
    el = parent.querySelectorAll<HTMLElement>(selector);
    await delay(100);

    retries++;
  }
  if (!el) {
    throw new Error(`Element ${selector} not found or empty`);
  }
  if (el.length < expectedLength) {
    throw new Error(
      `Element ${selector} only has ${el.length} elements, expected ${expectedLength}`
    );
  }
  return el;
};

export const waitForValue = async (
  element: HTMLInputElement | HTMLSelectElement,
  desiredValue: string,
  maxRetries = 10
): Promise<boolean> => {
  logger.debug(`Waiting for value ${desiredValue} in element ${element.id}`);

  let retries = 0;
  while (element.value !== desiredValue && retries < maxRetries) {
    await delay(500);

    retries++;
  }
  if (element.value !== desiredValue) {
    throw new Error(
      `Element ${element.id} value is ${element.value}, expected ${desiredValue}`
    );
  }
  return true;
};
