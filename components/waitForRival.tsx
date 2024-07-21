import { PaperClipIcon } from '@heroicons/react/24/outline';
import * as React from 'react';


export default function WaitForRival() {
    return (

        <div className="flex space-x-4 items-center">
            <span className="loader w-8 h-8"></span>
            <button onClick={() => {
                navigator.clipboard.writeText(window?.location?.href);
            }} className="p-5 py-3 bg-violet-400 font-semibold space-x-5 flex items-center justify-center group rounded-full text-white hover:bg-violet-500">
                <PaperClipIcon className="w-5 h-5 stroke-[2.5] text-violet-500  group-hover:text-violet-700" />
                <span>copy link</span>
            </button>
            <div className="font-semibold flex items-center space-x-4 text-white">

                <span className="animate-pulse">
                    waiting...
                </span>
            </div>
        </div>
    );
}

