import React from 'react';
import {executeFill} from './helper'

const FillButton: React.FC = () => {
  return (
    <div className="ml-2">
      <button
        onClick={executeFill}
        className="px-4 py-2 font-semibold text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-sm"
      >
        Auto Fill
      </button>
    </div>
  );
};

export default FillButton;
