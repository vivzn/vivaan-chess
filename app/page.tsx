"use client";

import { auth as authFB, provider } from "@/firebase";
import axios from "axios";
import { signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { getRedirectError } from "next/dist/client/components/redirect";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { BookmarkIcon, CpuChipIcon, CubeTransparentIcon, EllipsisHorizontalCircleIcon, PuzzlePieceIcon, InformationCircleIcon, LinkIcon, MinusIcon, PencilIcon, PencilSquareIcon, QuestionMarkCircleIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { SparklesIcon, ArrowLeftCircleIcon, GlobeAsiaAustraliaIcon, BoltIcon } from "@heroicons/react/24/solid";
import { RootContext } from "@/context";

export default function Home() {
  const [load, setLoad] = useContext<any>(RootContext).load;
  const [userFBData, setUserFBData] = useState<any>(null);

  const [user, setUser] = useContext<any>(RootContext).user;
  const router = useRouter();


  const signIn = async () => {

    signInWithPopup(authFB, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const user = result.user;

        console.log(user);

        axios.post('/api/create-user', { name: user?.displayName, elo: 500, email: user?.email, photoURL: user?.photoURL }).then((data: any) => {

          if (data?.data) {
            router.refresh();
          } else throw new Error("soemething went wrong in the api")

        })
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

      });


  }


  useEffect(() => {
    setLoad(false);
  }, [])

  // useEffect(() => {

  //   setLoad(false);

  //   const auth = authFB;
  //   getRedirectResult(auth)
  //     .then((result: any) => {

  //       if(!result) return;


  //       // This gives you a Google Access Token. You can use it to access Google APIs.
  //       // const credential = GoogleAuthProvider.credentialFromResult(result);
  //       // const token = credential.accessToken;

  //       // The signed-in user info.
  //       const user = result.user;

  //       console.log(user);

  //       axios.post('/api/create-user', { name: user?.displayName, elo: 500, email: user?.email, photoURL: user?.photoURL }).then((data: any) => {

  //         if (data?.data) {
  //           // router.refresh();
  //         } else throw new Error("soemething went wrong in the api")

  //       })



  //     }).catch((error) => {
  //       console.warn("an error occured", error);
  //     });
  // }, [])

  if (user) return (
    <Dashboard />
  )

  return (
    <div className="w-full h-full flex flex-col overflow-y-scroll simpleScroll bg-slate-800">
      <div className="h-fit w-full p-8 px-[250px]">
        <div className="flex space-x-4 justify-between items-center cursor-pointer select-none">
          <div onClick={() => router.push("/")} className="flex space-x-6 items-center cursor-pointer select-none">
            <SparklesIcon className="w-[34px] h-[34px] text-violet-400" />
            <span className="tracking-wide text-[24px] w-[155px] text-slate-200 font-bold">vivaan chess</span>
          </div>

          <div className="flex space-x-4 items-center">
            <div onClick={() => alert("this button is just for show lol")} className="rounded-full hover:bg-slate-600 transition duration-200 ease-in-out p-[10px] border-2 border-slate-600">
              <InformationCircleIcon className="w-5 h-5 text-slate-500 stroke-[2]" />
            </div>
            <div onClick={() => {
              alert("this button doesnt do anything lol");
              // navigator.clipboard.writeText(window?.location?.href)
            }} className="rounded-full hover:bg-slate-600 transition duration-200 ease-in-out p-[10px] border-2 border-slate-600">
              <LinkIcon className="w-5 h-5 text-slate-500 stroke-[2]" />
            </div>
            <div onClick={signIn} className="rounded-full hover:brightness-110 trans cursor-pointer p-[12px] px-[18px] text-white bg-gradient-to-r from-violet-500 to-purple-400 flex items-center space-x-2">
              <ArrowLeftCircleIcon className="w-6 h-6 stroke-[2] text-white-600/80" />
              <span className="font-semibold text-xl">sign in</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full px-80">

        <div className="w-full flex items-center justify-center space-x-10">
          {/* <video className="w-[245px] brightness-[1.15] h-[350px] object-cover rounded-full" autoPlay muted loop>
            <source src="/loopvideo.mp4" type="video/mp4" />
          </video> */}
          <div className="flex flex-col space-y-8 items-center w-fit">

            <div className="border-2 p-1 px-4 rounded-full border-violet-400/30 bg-violet-400/10 ">
              <span className="font-semibold text-xl colorGradient">{process.env.NEXT_PUBLIC_NAME ? process.env.NEXT_PUBLIC_NAME + " " : ""}hackathon project</span>
            </div>

            <div className="font-bold text-[100px] leading-[100px] w-[1300px] text-center text-white">this is the new <br /> <span className="colorGradient">standard for chess</span></div>

            <p className="font-semibold text-slate-400 text-xl text-center">play, learn, rank, and more.</p>
            <div className="flex items-center space-x-4">
              {/* <div onClick={() => router.push("/https://github.com/vivzn/king-chess")} className="rounded-full hover:brightness-110 trans cursor-pointer p-[10px] px-[14px] text-slate-300 bg-slate-600 flex items-center space-x-2">
                <LinkIcon className="w-5 h-5 stroke-[2.5] text-white-600/80" />
                <span className="font-semibold">view open source</span>
              </div> */}
              <div onClick={signIn} className="rounded-full hover:brightness-110 trans cursor-pointer p-[12px] px-[18px] text-white bg-gradient-to-r from-violet-500 to-purple-400 flex items-center space-x-2">
              <ArrowLeftCircleIcon className="w-6 h-6 stroke-[2] text-white-600/80" />
              <span className="font-semibold text-xl">sign in</span>
            </div>

            </div>


            {/* <br /> */}
            <br />
            <div className="flex space-x-[100px] items-start">
              <Image className="rounded-md rotateIT shadow-lg" alt="" src="/pic.png" width={350} height={350} />

              <div className="flex items-start space-x-8">
                <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-700 border-4 border-slate-600 rounded-full">
                  <BoltIcon className="w-[40px] h-[40px] text-violet-400" />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="font-bold text-[50px] text-white leading-[40px]"><span className="">master</span> the game.</div>
                  <br/>
                  <p className="font-semibold text-2xl text-slate-400">join vivaan chess today and play globally</p>
                  <br/>
                  <div className="flex-items-center space-y-4">
                    <div className="flex bg-black/10 space-x-4 items-center font-semibold text-white text-xl p-3 px-4 border-l-[5px] border-violet-400 rounded-r-full">
                      <LinkIcon className="w-8 h-8 text-white stroke-[2]"/>
                      <p className="">online game via link to share</p>
                    </div>
                    <div className="flex bg-black/10 space-x-4 items-center font-semibold text-white text-xl p-3 px-4 border-l-[5px] border-violet-400 rounded-r-full">
                      <PuzzlePieceIcon className="w-8 h-8 text-white  stroke-[2]"/>
                      <p className="">puzzles with hints and difficulty</p>
                    </div>
                    <div className="flex bg-black/10 space-x-4 items-center font-semibold text-white text-xl p-3 px-4 border-l-[5px] border-violet-400 rounded-r-full">
                      <CpuChipIcon className="w-8 h-8 text-white  stroke-[2]"/>
                      <p className="">bots of different level to play with</p>
                    </div>
                    <div className="flex bg-black/10 space-x-4 items-center font-semibold text-white text-xl p-3 px-4 border-l-[5px] border-violet-400 rounded-r-full">
                      <QuestionMarkCircleIcon className="w-8 h-8 text-white  stroke-[2]"/>
                      <p className="">chess trivia with wolfram alpha</p>
                    </div>
                    <div className="flex bg-black/10 space-x-4 items-center font-semibold text-white text-xl p-3 px-4 border-l-[5px] border-violet-400 rounded-r-full">
                      <PencilSquareIcon className="w-8 h-8 text-white stroke-[2]"/>
                      <p className="">analyse your games</p>
                    </div>
                    
                  </div>
                  
                  
                </div>
              </div>
            </div>
          </div>

        </div>



        <div className="flex w-full items-center justify-center self-center p-8">
          {/* <Rights/> */}
        </div>

      </div>

    </div>
  );
}
