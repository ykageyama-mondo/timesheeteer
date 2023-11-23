import { render } from 'react-dom';

import Popup from './Components/Popup';
import '../../assets/styles/tailwind.css';
import './index.css'
import {logger} from '@/helpers/logger'
logger.setContext('Popup')
render(<Popup />, window.document.querySelector('#app-container'));

if ((module as any).hot) (module as any).hot.accept();
