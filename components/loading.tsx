import * as React from 'react';


export default function Loading ({fit}: any) {
  return (
    <div className={`grid z-[10000] place-content-center bg-slate-800 ${fit ? "w-full h-full" : "w-screen h-screen absolute"}`}>   
      <span className="loader w-10 h-10"></span>
    </div>
  );
}
