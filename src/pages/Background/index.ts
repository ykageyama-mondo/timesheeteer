import {logger} from '@/helpers/logger'

const sendFill = (tabId: number) => {
  return new Promise(async (resolve) => {
    await chrome.tabs.update(tabId, {active: true})
    chrome.tabs.sendMessage(tabId, {action: "executeFill"}, async function(response) {
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
          await chrome.tabs.create({url: 'https://performancemanager10.successfactors.com/sf/timesheet', active: true}).then(async(tab) => {
            setTimeout(() => sendFill(tab.id!), 10000)
          })
          logger.error('No tabs found. Tab failed to create. Aborting.')
          sendResponse({error: 'No tabs found. Tab failed to create. Aborting.'})
          return
      } else {
        logger.log('Found timesheet tab', tabs)
        await sendFill(tabs[0].id!)
        sendResponse({success: true})
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