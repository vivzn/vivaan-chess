"use client";

import { RootContext } from "@/context";
import {
    AtSymbolIcon,
    MinusIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {
    AcademicCapIcon,
    FaceSmileIcon,
    ExclamationTriangleIcon,
    FaceFrownIcon,
    MinusCircleIcon,
    FireIcon,
    HandThumbDownIcon,
    HandThumbUpIcon,
    UserIcon,
    InformationCircleIcon,
    TrophyIcon,
    InboxIcon,
    ArchiveBoxIcon,
    StarIcon,
    SparklesIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";

const fetcher = (url: any) => fetch(url).then((res) => res.json());

function Page() {
    const [user, setUser] = useContext(RootContext).user;

    const id = usePathname()?.replaceAll("/users/", "");

    const fetcher = (url: any) => axios.post('/api/get-user', { _id: id }).then((data: any) => data)

    const { data, error, isLoading } = useSWR(`/api/get-user`, fetcher, {
        refreshInterval: 1000,
        dedupingInterval: 1000,
    });

    //   useEffect(() => {
    //     console.log(isLoading, data);
    //     if (!isLoading && (!data || !data?.email)) {
    //       throw new Error("Something went wrong");
    //     }
    //   }, [data, isLoading]);

    const [wdl, setWDL] = useState<any>(null);

    const [games, setGames] = useState<any>();

    useEffect(() => {

        if (data?.data?.email) {

            console.log(user?.email)

            axios.post('/api/get-games-user', { email: user?.email }).then((data: any) => {
                setGames(data?.data.filter((g: any) => g?.members?.length >= 1 && g?.gameStatus == "finished"));
            })

            // console.log(res_)


        }


    }, [data]);

    const router = useRouter();

    useEffect(() => {
        if (!user || !games) return;
        let draw = 0;
        let win = 0;
        let loss = 0;

        games.forEach((element: any) => {
            // const playedAs = element?.members?.filter(
            //     (m: any) => data?.email == m?.user
            // )[0]?.side;
            // if (element?.winner?.winner == "-") {
            //     draw += 1;
            // } else {
            //     if (element?.winner?.winner == playedAs) {
            //         win += 1;

            //     } else {
            //         loss += 1;
            //     }
            // }

            const playedAs = element?.members?.filter(
                (m: any) => data?.data?.email == m?.user
            )[0]?.side;

            console.log(element?.winner?.winner, playedAs)

            if (element?.winner?.winner == "-") {
                draw += 1;
            } else {
                if (element?.winner?.winner == playedAs) {
                    win += 1;
                } else {
                    loss += 1;
                }
            }
        });

        setWDL({ win, draw, loss });
        console.log(win, draw, loss);
    }, [games]);


    if (error) {
        return <div>
            <div className="w-full h-full p-8 flex space-x-4 items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-violet-300" />
                <p className="font-semibold text-white">error: user doesnt exist or something went wrong</p>
                <button onClick={() => {
                    router.refresh();
                }} className="p-2 rounded-full hover:brightness-110 trans bg-violet-300 text-ellipsis font-semibold text-violet-600 px-4">refresh</button>
            </div>
        </div>
    }


    return (
        <div className="w-full h-full grid place-content-center">
            <div className="p-4 mt-4 rounded-[40px] bg-slate-800 flex flex-col items-center justify-center space-y-4">
                <div className="flex space-x-4 w-full items-center justify-between pr-2">
                    <div className="flex space-x-4 items-center">
                        <Image
                            alt="Pfp"
                            src={data?.data?.photoURL}
                            width={55}
                            height={55}
                            className="w-[55px] h-[55px] rounded-full"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold">{data?.data?.displayName}</h1>
                            <span className="flex flex-col">
                                <span className="text-white font-bold space-x-2 flex items-center">

                                    <span>{data?.data?.name}</span>
                                </span>
                                <span className="font-bold text-violet-200 flex items-center space-x-2">
                                    <TrophyIcon className="w-5 h-5" />
                                    <span>{data?.data?.elo}</span>
                                </span>


                            </span>
                        </div>
                    </div>
                    <UserIcon className="text-slate-500 w-7 h-7" />
                </div>


                <div className="flex items-center w-full flex-grow-[1]">
                    <button onClick={() => navigator.clipboard.writeText(data?.data?._id)} className="bg-violet-400 hover:brightness-110 rounded-3xl rounded-r-none p-4 py-1 font-semibold text-violet-800 w-fit">copy</button>
                    <span className="font-semibold text-slate-400 w-full border-2 h-full bg-white/5 border-slate-600 flex items-center justify-center px-3 rounded-r-3xl border-l-0">#{data?.data?._id}</span>
                </div>

                <p onClick={() => {
                    toast.custom(<div className="p-4 bg-slate-600 rounded-xl shadow-xl font-semibold space-y-4">
                        <div className="flex space-x-2 font-semibold">
                            <span className="text-violet-300">challenger I: </span>
                            <span className="text-white">600 trophies</span>
                        </div>
                        <div className="flex space-x-2 font-semibold">
                            <span className="text-violet-300">challenger II: </span>
                            <span className="text-white">800 trophies</span>
                        </div>
                        <div className="flex space-x-2 font-semibold">
                            <span className="text-violet-300">challenger III: </span>
                            <span className="text-white">1000 trophies</span>
                        </div>
                        <div className="flex space-x-2 font-semibold">
                            <span className="text-violet-300">guardian I: </span>
                            <span className="text-white">1200 trophies</span>
                        </div>
                        <div className="flex space-x-2 font-semibold">
                            <span className="text-violet-300">guardian II: </span>
                            <span className="text-white">1400 trophies</span>
                        </div>
                        <div className="flex space-x-2 font-semibold">
                            <span className="text-violet-300">guardian III: </span>
                            <span className="text-white">1600 trophies</span>
                        </div>
                        <div className="flex space-x-2 font-semibold">
                            <span className="text-violet-300">novice master: </span>
                            <span className="text-white">1800 trophies</span>
                        </div>
                        <div className="flex space-x-2 font-semibold">
                            <span className="text-violet-300">master: </span>
                            <span className="text-white">2000 trophies</span>
                        </div>
                        <div className="flex space-x-2 font-semibold">
                            <span className="text-violet-300">champion: </span>
                            <span className="text-white">2200 trophies</span>
                        </div>
                        <div className="flex space-x-2 font-semibold">
                            <span className="text-violet-300">ultimate champion: </span>
                            <span className="text-white">2400 trophies</span>
                        </div>
                    </div>, { duration: 10000 })
                }} className="font-semibold cursor-pointer text-sm text-slate-400 flex space-x-2">
                    <AcademicCapIcon className="w-5 h-5 text-violet-300" />
                    <span className="underline">see all ranks</span>
                </p>
                <>
                    {data?.data?.elo <= 600 && <div className="flex flex-col w-full space-y-1">
                        <div className="w-full rounded-xl bg-orange-600/30 text-white/60 p-4 items-center flex space-x-4">
                            <StarIcon className="w-6 h-6" />
                            <span className="font-bold">challenger I</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-500"><span className="italic">{600 - data?.data?.elo}</span> more trophies for <span className="text-slate-400">challenger II</span></div>
                    </div>}
                </>

                <>
                    {data?.data?.elo > 600 && data?.data?.elo <= 800 && <div className="flex flex-col w-full space-y-1">
                        <div className="w-full rounded-xl bg-orange-600/30 text-white/60 p-4 items-center flex space-x-4">
                            <StarIcon className="w-6 h-6" />
                            <span className="font-bold">challenger II</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-500"><span className="italic">{800 - data?.data?.elo}</span> more trophies for <span className="text-slate-400">challenger III</span></div>
                    </div>}
                </>

                <>
                    {data?.data?.elo > 800 && data?.data?.elo <= 1000 && <div className="flex flex-col w-full space-y-1">
                        <div className="w-full rounded-xl bg-orange-600/30 text-white/60 p-4 items-center flex space-x-4">
                            <StarIcon className="w-6 h-6" />
                            <span className="font-bold">challenger III</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-500"><span className="italic">{1000 - data?.data?.elo}</span> more trophies for <span className="text-slate-400">guadian I</span></div>
                    </div>}
                </>

                <>
                    {data?.data?.elo > 1000 && data?.data?.elo <= 1200 && <div className="flex flex-col w-full space-y-1">
                        <div className="w-full rounded-xl bg-slate-300/30 text-white/60 p-4 items-center flex space-x-4">
                            <StarIcon className="w-6 h-6" />
                            <span className="font-bold">guardian I</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-500"><span className="italic">{1200 - data?.data?.elo}</span> more trophies for <span className="text-slate-400">guardian II</span></div>
                    </div>}
                </>

                <>
                    {data?.data?.elo > 1200 && data?.data?.elo <= 1400 && <div className="flex flex-col w-full space-y-1">
                        <div className="w-full rounded-xl bg-slate-300/30 text-white/60 p-4 items-center flex space-x-4">
                            <StarIcon className="w-6 h-6" />
                            <span className="font-bold">guardian II</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-500"><span className="italic">{1400 - data?.data?.elo}</span> more trophies for <span className="text-slate-400">guardian III</span></div>
                    </div>}
                </>

                <>
                    {data?.data?.elo > 1400 && data?.data?.elo <= 1600 && <div className="flex flex-col w-full space-y-1">
                        <div className="w-full rounded-xl bg-slate-300/30 text-white/60 p-4 items-center flex space-x-4">
                            <StarIcon className="w-6 h-6" />
                            <span className="font-bold">guardian III</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-500"><span className="italic">{1600 - data?.data?.elo}</span> more trophies for <span className="text-slate-400">master</span></div>
                    </div>}
                </>

                <>
                    {data?.data?.elo > 1600 && data?.data?.elo <= 1800 && <div className="flex flex-col w-full space-y-1">
                        <div className="w-full rounded-xl bg-blue-300/30 text-blue-400/60 p-4 items-center flex space-x-4">
                            <StarIcon className="w-6 h-6" />
                            <span className="font-bold">master</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-500"><span className="italic">{1800 - data?.data?.elo}</span> more trophies for <span className="text-slate-400">master II</span></div>
                    </div>}
                </>

                <>
                    {data?.data?.elo > 1800 && data?.data?.elo <= 2000 && <div className="flex flex-col w-full space-y-1">
                        <div className="w-full rounded-xl bg-red-300/30 text-red-400/60 p-4 items-center flex space-x-4">
                            <StarIcon className="w-6 h-6" />
                            <span className="font-bold">master III</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-500"><span className="italic">{2000 - data?.data?.elo}</span> more trophies for <span className="text-slate-400">champion</span></div>
                    </div>}
                </>

                <>
                    {data?.data?.elo > 2000 && data?.data?.elo <= 2200 && <div className="flex flex-col w-full space-y-1">
                        <div className="w-full rounded-xl bg-blue-400/40 text-white p-4 items-center flex space-x-4">
                            <SparklesIcon className="w-6 h-6 text-amber-400" />
                            <span className="font-bold">champion</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-500"><span className="italic">{2200 - data?.data?.elo}</span> more trophies for <span className="text-slate-400">ultimate champion</span></div>
                    </div>}
                </>

                <>
                    {data?.data?.elo > 2200 && data?.data?.elo <= 2400 && <div className="flex flex-col w-full space-y-1">
                        <div className="w-full rounded-xl bg-violet-400/40 text-white p-4 items-center flex space-x-4">
                            <TrophyIcon className="w-6 h-6 text-amber-400" />
                            <span className="font-bold">ultimate champion</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-500">you are at the highest rank</div>
                        {/* <div className="text-sm font-semibold text-slate-500"><span className="italic">{1600 - data?.data?.elo}</span> more trophies for <span className="text-slate-400">ultimate champion</span></div> */}
                    </div>}
                </>

                <div className="flex flex-col space-y-4 justify-center items-center">

                    <div className="font-semibold flex space-x-3 text-white items-center">
                        <ArchiveBoxIcon className="w-6 h-6 text-violet-300" />
                        <span className="text-[18px]"><span className="">{games?.length || 0}</span> games played</span>
                    </div>
                </div>
                <div className="space-x-4 w-[400px] items-center flex">
                    <div className="p-2 w-1/3 rounded-md rounded-l-3xl font-bold justify-center flex bg-violet-400/20 text-violet-400">
                        {wdl?.win} victories
                    </div>
                    <div className="p-2 w-1/3 rounded-md font-bold justify-center flex bg-gray-400/20 text-gray-400">
                        {wdl?.draw} draws
                    </div>
                    <div className="p-2 w-1/3 rounded-md rounded-r-3xl font-bold justify-center flex bg-red-400/20 text-red-400">
                        {wdl?.loss} losses
                    </div>
                </div>
                <div className="flex space-x-4 items-center">
                    <h1 className="font-semibold text-white">
                        <>
                            {wdl && wdl?.loss == 0 && wdl?.win >= 1 ? (
                                <>
                                    <span className="text-red-400 font-bold flex space-x-2 items-center">
                                        <TrophyIcon className="w-5 h-5" />
                                        <span>Undefeated Ratio</span>
                                    </span>
                                </>
                            ) : (
                                <div className="flex space-x-2">
                                    <span className="text-violet-300">{isNaN((wdl?.win / wdl?.loss).toFixed(2) as any)
                                        ? 0
                                        : (wdl?.win / wdl?.loss).toFixed(2)}%</span>
                                    <span>w / l ratio</span>
                                </div>
                            )}
                        </>
                    </h1>


                </div>
            </div>
        </div>
    );
}

export default Page;


// useEffect(() => {
//     axios.post('/api/get-user', { _id: pathname }).then((data: any) => {
//         if (!data?.data) {
//             setThisUser("no")
//             return;
//         }
//        setThisUser(data?.data)
//     });
// }, [])