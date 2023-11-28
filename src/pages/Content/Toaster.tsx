import React, {useEffect} from 'react';
import toast, {Toaster} from 'react-hot-toast'
import {observable} from '.'
import {logger} from '@/helpers/logger'

let resolveFill: () => void;
let rejectFill: () => void;

const Injected: React.FC = () => {
  useEffect(() => {
    observable.subscribe((action: string, data?: any) => {
      logger.log(`Received ${action} action`, data)
      switch(action) {
        case 'success': {
          resolveFill?.()
          break
        }
        case 'error': {
          rejectFill?.()
          break
        }
        case 'start': {
          toast.promise(new Promise<void>((resolve, reject) => {
            resolveFill = resolve
            rejectFill = reject
          }), {
            success: 'Successfully Filled!',
            loading: `Filling TimeSheet with ${data.size} records`,
            error: 'Error filling TimeSheet. Refresh the page and try again. If it still fails let me know :)'
          }, {
            error: {
              duration: 7000,
            }
          })
        }
      }
    })
  })

  return (
    <div className="">
      <Toaster
        position="bottom-center"
        containerStyle={{
          bottom: 75,
        }}
      />
    </div>
  );
};

export default Injected;
