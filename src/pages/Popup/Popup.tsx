import React from 'react';
import './Popup.css';
import {logger} from '@/helpers/logger'

const timeOptions = [{
  label: 'worked',
  value: 'Normal Time'
}, {
  label: 'took a break',
  value: 'Break'
}]

const Popup = () => {
  const [test, setTest] = React.useState('')
  const [timeType, setTimeType] = React.useState('Normal Time')

  React.useEffect(() => {
    chrome.storage.local.get(['test']).then((result) => {
      logger.log('Getting test', result)
      setTest(result.test)
    })
  }, [])

  const handleClick = () => {
    logger.log('hit')
    chrome.storage.local.set({['test']: `test${Math.random()}`}).then(() => {
      logger.log('Setting test')

      chrome.storage.local.get(['test']).then((result) => {
        logger.log('Getting test after set', result)

        setTest(result.test)
      })
    });
  }

  return (
    <div className="p-5 bg-stone-50 w-[300px]">
      <p className="font-bold text-4xl">
        I 
        <select value={timeType} onChange={(e) => setTimeType(e.target.value)}>
        {timeOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </p>
      <button className="p-4 bg-rose-200 rounded-lg"onClick={handleClick}>Hit me</button>
      <p>Local storage test: {test}</p>
    </div>
  );
};

export default Popup;
