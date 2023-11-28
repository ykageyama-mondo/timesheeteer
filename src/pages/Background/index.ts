import { delay } from '@/helpers/delay';
import {isSupportedKey, supportedKeys} from '@/helpers/keyCode'
import { logger } from '@/helpers/logger';
import { TimeRecord } from '@/models/timeRecord';
logger.setContext('Background');
const sendFill = (tabId: number, data: { records: TimeRecord[] }) => {
  return new Promise(async (resolve) => {
    chrome.tabs.sendMessage(
      tabId,
      { action: 'executeFill', data },
      async function (response) {
        resolve(response);
      }
    );
  });
};

const getOrCreateTab = async () => {
  const tabs = await chrome.tabs.query({
    url: 'https://performancemanager10.successfactors.com/sf/timesheet*',
  });
  let tab = tabs[0];
  if (tabs.length === 0) {
    logger.warn('No tabs found. Creating new tab and retrying.');
    tab = await chrome.tabs.create({
      url: 'https://performancemanager10.successfactors.com/sf/timesheet',
      active: true,
    });
    await delay(10000);
  }
  await chrome.tabs.update(tab.id!, { active: true });
  return tab;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  new Promise<void>(async (resolve) => {
    logger.log(`Received ${request.action} request`, request);
    const tab = await getOrCreateTab();
    const tabId = tab.id!;
    switch (request.action) {
      case 'fill': {
        logger.log('Sending fill to tab', tab.id);
        await new Promise<void>((res) =>
          chrome.debugger.attach({ tabId }, '1.3', () => res())
        );
        await sendFill(tab.id!, request.data);
        break;
      }
      case 'click': {
        await new Promise<void>((res) => {
          chrome.debugger.sendCommand(
            { tabId },
            'Input.dispatchMouseEvent',
            {
              type: 'mousePressed',
              x: request.data.coordX,
              y: request.data.coordY,
              button: 'left',
              clickCount: 1,
            },
            () => {
              logger.log('mousePress send command callback');
              res();
            }
          );
        });
        await delay(200);
        await new Promise<void>((res) => {
          chrome.debugger.sendCommand(
            { tabId },
            'Input.dispatchMouseEvent',
            {
              type: 'mouseReleased',
              x: request.data.coordX,
              y: request.data.coordY,
              button: 'left',
              clickCount: 1,
            },
            () => {
              logger.log('mouseRelease send command callback');
              res();
            }
          );
        });
        break;
      }
      case 'scrollIntoView': {
        const document = await new Promise((res) =>
          chrome.debugger.sendCommand(
            { tabId },
            'DOM.getDocument',
            { depth: -1 },
            (document) => res(document)
          )
        );
        const target = await new Promise((res) =>
          chrome.debugger.sendCommand(
            { tabId },
            'DOM.querySelector',
            {
              nodeId: (document as any).root.nodeId,
              selector: request.data.el,
            },
            (target) => res(target)
          )
        );
        await new Promise<void>((res) =>
          chrome.debugger.sendCommand(
            { tabId },
            'DOM.scrollIntoViewIfNeeded',
            { nodeId: (target as any).nodeId },
            () => {
              logger.log('Scrolled');
              res();
            }
          )
        );
        break;
      }
      case 'keyDown': {
        const keyCode = request.data.keyCode;
        if (!isSupportedKey(keyCode))
          break;

        await new Promise<void>((res) => {
          chrome.debugger.sendCommand(
            { tabId },
            'Input.dispatchKeyEvent',
            {
              type: 'keyDown',
              ...supportedKeys[keyCode],
            },
            () => {
              logger.log('keyDown send command callback');
              res();
            }
          );
        });
        break;
      }
    }
    sendResponse({ success: true });
    resolve()
  });
  return true;
});

chrome.runtime.onSuspend.addListener(() => {
  logger.log('Background script suspended');
});
