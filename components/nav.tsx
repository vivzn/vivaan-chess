import { RootContext } from '@/context';
import { auth, auth as authFB } from '@/firebase';
import { ArrowLeftEndOnRectangleIcon, ArrowLeftIcon, ChatBubbleOvalLeftIcon, CogIcon, InboxStackIcon } from '@heroicons/react/24/outline';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { ArrowLeftCircleIcon, Bars3Icon, CpuChipIcon, EnvelopeIcon, ArchiveBoxIcon, InformationCircleIcon, PuzzlePieceIcon, UserCircleIcon, EllipsisHorizontalCircleIcon, UserIcon, PencilSquareIcon, ComputerDesktopIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { CubeTransparentIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import UserDefault from './userDefault';

export function Nav() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = React.useContext<any>(RootContext).user;
  //
    const signOut = () => {
        const auth = authFB;
        auth.signOut().then(() => {
            router.refresh();

        })
    }


    return (
        <div className="h-screen bg-slate-800 w-fit flex items-start text-zinc-700 p-6 space-x-6">

            <div className="w-fit space-y-6 h-full flex flex-col">

                <div className='flex items-center w-full h-full space-y-6 justify-between flex-col'>
                    <div className='flex space-y-6 flex-col'>
                        <div onClick={() => router.push("/")} className="flex space-x-6 items-center cursor-pointer select-none">
                            <SparklesIcon className="w-[30px] h-[30px] text-violet-300" />
                            <span className="tracking-wide text-[21px] w-[155px] text-slate-200 font-bold">vivaan chess</span>
                            <div className="rounded-full bg-slate-700 text-slate-600 text-sm flex items-center space-x-[6px] justify-center p-2 py-1">

                                <InformationCircleIcon className="w-[14px] h-[14px] stroke-[2.5] text-slate-500" />
                                <span className="text-[11px] font-semibold text-white">v{process?.env.NEXT_PUBLIC_VERSION || 1.0}</span>
                            </div>
                        </div>

                        <div onClick={() => router.push("/")} className={`flex gap-6 items-center group cursor-pointer`}>
                            {pathname == "/" && <div className='w-[4px] left-0 h-8 rounded-r-xl bg-violet-300 absolute'>
                            </div>}
                            <ArchiveBoxIcon className="w-[24px] h-[24px] ml-[3px] stroke-[2] text-slate-600 group-hover:text-violet-300 trans" />
                            <span className="font-[600] text-[18px] text-slate-500 group-hover:text-slate-200 trans">dashboard</span>
                        </div>

                        {/* {/* <div  onClick={() => router.push("/dms")} className='flex space-x-6 items-center group cursor-pointer'>
                            <ChatBubbleOvalLeftIcon className="w-[24px] h-[24px] ml-[3px] stroke-[2] text-slate-600 group-hover:text-violet-300 trans" />
                            <span className="font-[600] text-[18px] text-slate-500 group-hover:text-slate-200 trans">my dms</span>
                        </div> */}
                        <div onClick={() => router.push("/puzzles")} className={`flex gap-6 items-center group cursor-pointer`}>
                            {pathname == "/puzzles" && <div className='w-[4px] left-0 h-8 rounded-r-xl bg-violet-300 absolute'>
                            </div>}
                            <PuzzlePieceIcon className="w-[24px] h-[24px] ml-[3px] stroke-[2] text-slate-600 group-hover:text-violet-300 trans" />
                            <span className="font-[600] text-[18px] text-slate-500 group-hover:text-slate-200 trans">puzzles</span>
                        </div>

                        <div onClick={() => router.push("/bots")} className={`flex gap-6 items-center group cursor-pointer`}>
                            {pathname == "/bots" && <div className='w-[4px] left-0 h-8 rounded-r-xl bg-violet-300 absolute'>
                            </div>}
                            <CpuChipIcon className="w-[24px] h-[24px] ml-[3px] stroke-[2] text-slate-600 group-hover:text-violet-300 trans" />
                            <span className="font-[600] text-[18px] text-slate-500 group-hover:text-slate-200 trans">bots</span>
                        </div>

                        <div onClick={() => router.push("/analyze")} className={`flex gap-6 items-center group cursor-pointer`}>
                            {pathname == "/analyze" && <div className='w-[4px] left-0 h-8 rounded-r-xl bg-violet-300 absolute'>
                            </div>}
                            <ComputerDesktopIcon className="w-[24px] h-[24px] ml-[3px] stroke-[2] text-slate-600 group-hover:text-violet-300 trans" />
                            <span className="font-[600] text-[18px] text-slate-500 group-hover:text-slate-200 trans">analyze</span>
                        </div>

                        <div onClick={() => router.push(`/users/${user?._id}`)} className={`flex gap-6 items-center group cursor-pointer`}>
                            {pathname == `/users/${user?._id}` && <div className='w-[4px] left-0 h-8 rounded-r-xl bg-violet-300 absolute'>
                            </div>}
                            <UserIcon className="w-[24px] h-[24px] ml-[3px] stroke-[2] text-slate-600 group-hover:text-violet-300 trans" />
                            <span className="font-[600] text-[18px] text-slate-500 group-hover:text-slate-200 trans">my profile</span>
                        </div>

                       
                    </div>

                    <div className='flex flex-col space-y-3  w-full'>
                        <div className='flex items-center space-x-6 w-full'>

                            <div className='w-full h-fit'>
                                <UserDefault user={user} />
                            </div>
                        </div>
                        <button onClick={() => {
                            auth.signOut().then(() => {
                                setUser(null);
                                router.refresh();
                            })
                            
                        }} className='bg-violet-400/20 p-1 rounded-full text-violet-400 font-semibold'>logout</button>

                    </div>
                </div>
            </div>
        </div>

    );
}


// <div className="h-full w-fit p-4 bg-slate-200">
//             <p>signed in</p>
//             <button onClick={() => {
//                 console.log("wait")
//                 const auth = authFB;
//                 auth.signOut().then(() => {
//                     router.refresh();

//                 })
//             }} className="bg-red-500">log out</button>
//         </div>