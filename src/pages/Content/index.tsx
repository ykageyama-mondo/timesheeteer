import {logger} from '@/helpers/logger'
import {render} from 'react-dom'
import FillButton from './FillButton'
import './index.css'
import '../../assets/styles/tailwind.css';
import {executeFill} from './helper'

logger.setContext('Content')
const observer = new MutationObserver(() => {
  const toolbar = document.querySelector('#__component1---timeRecordingView--timeRecordingTitle-_actionsToolbar')
  const mycont = document.querySelector('#injected-container')
  if (toolbar && !mycont) {
    const cont = document.createElement('div')
    cont.className = 'tailwind'
    cont.id = 'injected-container'
    toolbar.appendChild(cont)
    render(<FillButton/>, cont)
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
  logger.log('Received Fill Message. Executing fill')
  logger.log(request)
  new Promise<void>(async (resolve) => {
    if (request.action === 'executeFill') {
      logger.log('Received Fill Message. Executing fill')
      executeFill(request.data)
    }
    sendResponse({success: true})
    resolve()
  })
  return true
})
