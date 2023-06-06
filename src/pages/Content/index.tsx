import {logger} from '@/helpers/logger'
import {render} from 'react-dom'
import FillButton from './FillButton'
import './index.css'
import '../../assets/styles/tailwind.css';

let fillBtnRendered = false
let btn: any = null

const observer = new MutationObserver(() => {
  const toolbar = document.querySelector('#__toolbar0')
  const recordBtnId = '__component1---timeRecordingView--attendancesClock--add'

  if (!btn || !document.body.contains(btn)) {
    btn = document.querySelector(`#${recordBtnId}`)
  }

  if (toolbar && !fillBtnRendered) {
    const cont = document.createElement('div')
    cont.className = 'tailwind'
    toolbar.appendChild(cont)
    render(<FillButton/>, cont)
    fillBtnRendered = true
  }
})

window.addEventListener('load', () => {
  logger.log('Page loaded, starting observer')
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
})