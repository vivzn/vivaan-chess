import { RootContext } from '@/context';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline';
import { AdjustmentsHorizontalIcon, PencilSquareIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import * as React from 'react';


export default function UserDefault({ user, bg, border }: any) {
    const router = useRouter();
    const [user_, setUser] = React.useContext(RootContext).user;
    return (
        <div onClick={() => router.push(`/users/${user?._id}`)} style={bg && { backgroundColor: bg }} className={`flex justify-between items-center hover:brightness-[1.1] cursor-pointer trans space-x-4 pr-[10px] rounded-full px-[10px] py-[10px] ${bg ? `` : "bg-slate-700"} ${border && "border-2 border-slate-600"}`}>
            <div className='flex items-center space-x-4'>
                <img className='rounded-full border-slate-500 w-[40px] h-[40px]' src={user?.photoURL} />

                <div className='flex flex-col space-y-1'>


                    <span className="font-bold text-white text-[14px]">{user?.name.substring(0, 12).toLowerCase()}</span>
                    <div className='flex items-center space-x-2'>
                        <TrophyIcon className="w-[14px] h-[14px] text-violet-300" />
                        <span className="font-semibold text-violet-300 text-[12px]">{user?.elo}</span>
                    </div>
                </div>
            </div>

            <EllipsisHorizontalCircleIcon className='w-6 h-6 text-slate-500' />

        </div>
    );
}
