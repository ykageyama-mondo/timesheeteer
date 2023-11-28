import {logger} from '@/helpers/logger'
import {render} from 'react-dom'
import Toaster from './Toaster'
import './index.css'
import '../../assets/styles/tailwind.css';
import {executeFill} from './helper'

const subscribers: Array<(action: string, data?: any) => void> = []
export const observable = {
  subscribe: (fn: (action: string, data?: any) => void) => {
    subscribers.push(fn)
  },
  notify: (action: string, data?: any) => {
    subscribers.forEach((fn) => fn(action, data))
  },
}

logger.setContext('Content')
const observer = new MutationObserver(() => {
  const mycont = document.querySelector('#injected-container')
  if (document.body && !mycont) {
    const cont = document.createElement('div')
    cont.id = 'injected-container'
    document.body.appendChild(cont)
    render(<Toaster/>, cont)
  }
})

window.addEventListener('load', () => {
  logger.log('Page loaded, starting observer')
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  logger.log(request)
  new Promise<void>(async (resolve) => {
    if (request.action === 'executeFill') {
      observable.notify('start', {size: request.data.records.length})
      logger.log('Received Fill Message. Executing fill')
      executeFill(request.data).then(() =>  {
        observable.notify('success')
      }).catch(() => {
        observable.notify('error')
      })
    }
    sendResponse({success: true})
    resolve()
  })

  return true
})
