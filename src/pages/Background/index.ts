import {logger} from '@/helpers/logger'
import {TimeRecord} from '@/models/timeRecord'

const sendFill = (tabId: number, data: {records: TimeRecord[]}) => {
  return new Promise(async (resolve) => {
    await chrome.tabs.update(tabId, {active: true})
    chrome.tabs.sendMessage(tabId, {action: "executeFill", data}, async function(response) {
      resolve(response)
    });
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  logger.log('Received message', request)
  if (request.action === 'fill') {
    chrome.tabs.query({url: 'https://performancemanager10.successfactors.com/sf/timesheet*'}, async function(tabs){
      if (tabs.length === 0) {
          logger.warn('No tabs found. Creating new tab and retrying.')
          await new Promise<void>(async (resolve) => {
            const tab = await chrome.tabs.create({url: 'https://performancemanager10.successfactors.com/sf/timesheet', active: true})
            setTimeout(() => {
              sendFill(tab.id!, request.data)
              resolve()
            }, 10000)
          })
          logger.error('No tabs found. Tab failed to create. Aborting.')
          sendResponse({error: 'No tabs found. Tab failed to create. Aborting.'})
          return
      } else {
        logger.log('Found timesheet tab', tabs)
        await new Promise<void> ((resolve) => setTimeout(async () => {
          await sendFill(tabs[0].id!, request.data)
          sendResponse({success: true})
          resolve()
        }, 1000))
        return
      }
    });
  } else {
    sendResponse({error: 'No action found'})
    return
  }
})

chrome.runtime.onSuspend.addListener(() => {
  logger.log('Background script suspended')
})