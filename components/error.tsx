import * as React from 'react';


export default function Error ({fit}: any) {
  return (
    <div className={`grid z-[10000] place-content-center bg-slate-700 ${fit ? "w-full h-full" : "w-screen h-screen absolute"}`}>   
      <div className='p-6 bg-slate-600 rounded-full'>
          <p className='text-2xl text-white font-bold'>Error</p>
      </div>
    </div>
  );
}
