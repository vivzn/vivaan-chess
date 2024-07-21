import { InformationCircleIcon } from '@heroicons/react/24/solid';
import * as React from 'react';


export default function MyCustomTip ({text}: any) {
  return (
   <div className='p-2 pr-3 py-2 flex space-x-2 text-white font-semibold rounded-full bg-slate-600 shadow-md'>
    <InformationCircleIcon className="w-6 h-6 text-blue-300"/>
    <span>{text}</span>
   </div>
  );
}
