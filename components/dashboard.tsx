import { AcademicCapIcon, ArchiveBoxIcon, BookmarkIcon, ChartBarIcon, CpuChipIcon, PlusCircleIcon, EyeIcon, GlobeAsiaAustraliaIcon, GlobeEuropeAfricaIcon, PuzzlePieceIcon, SquaresPlusIcon, ComputerDesktopIcon, BookOpenIcon, KeyIcon, TrophyIcon } from '@heroicons/react/24/solid';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import MyCustomTip from './mycustomtip';
import { RootContext } from '@/context';
import { ChevronDownIcon, MagnifyingGlassCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import UserDefault from './userDefault';

export function Dashboard() {

  const [user, setUser] = useContext(RootContext).user;
  const [load, setLoad] = useContext(RootContext).load;

  const router = useRouter();

  const createGame = async () => {
    const game = {
      members: [{ side: "w", user: user?.email }],
      moves: [],
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      gameStatus: "waiting", //make an enum here
      bTime: {
        time: "60:00",
        stopped: true,
      },
      wTime: {
        time: "60:00",
        stopped: true,
      },
      started: new Date(),
    }

    setLoad(true);
    const createdPost = await axios.post('/api/create-game', game);
    const gameData = createdPost?.data;
    if (gameData) {
      setLoad(false);
      router.push(`/game/${gameData?._id}`)
    } else {
      throw new Error("something wenrt wortjng ")
      setLoad(false);


    }
  }

  const [searchTerm, setSearchTerm] = useState<any>("");


  return (
    <div className='w-full h-full'>
      <div className='py-20 w-full h-full  px-[160px] flex flex-col space-y-6 overflow-y-scroll simpleScroll'>
        <div className='text-white text-[30px] font-bold w-full translate-y-[2px] justify-between flex space-x-6 items-end'>
          <div className='flex space-x-6 items-center'>
            <ArchiveBoxIcon className='w-9 h-9 text-violet-300' />
            <span className='leading-3'>dashboard</span>
          </div>
          <div className=''>
            <UserDefault user={user} bg={"#334155"} border={true} />
          </div>
        </div>
        <div className='rounded-full w-full  bg-slate-800 p-3 px-3 pl-4 flex space-x-4  items-center'>
          <MagnifyingGlassIcon className='w-6 h-6 text-slate-500 stroke-[2.5]' />
          <form className='w-full' onSubmit={(e: any) => {
            e.preventDefault();
            router.push(`/users/${searchTerm}`);
          }}>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e?.target.value)} className='bg-transparent h-full w-full outline-none focus:outline-none placeholder:text-slate-500 text-white font-semibold' placeholder="paste a user #id to see their profile" />
          </form>
          <div className='flex items-center space-x-2 rounded-full p-2 py-3 px-2 bg-slate-700'>
            {/* <ChevronDownIcon className='w-4 h-4 text-slate-400 stroke-[2.5]' /> */}
            <span className="text-slate-400 font-semibold leading-[6px] translate-y-[-0px]">users</span>
          </div>
        </div>
        {/* <div className='flex w-full items-center bg-red-50'> */}
        <div onClick={() => {
          createGame();
        }} className='rounded-2xl hover:brightness-[1.05] cursor-pointer trans w-full p-6 py-[24px] font-semibold flex items-center space-x-4 justify-center bg-gradient-to-tr from-purple-400 to-blue-400 text-white'>
          <PlusCircleIcon className='w-8 h-8 stroke-[2.5]' />
          <span className="text-[26px]">create game</span>
        </div>
        <div className='w-[52px]'>
        </div>
        {/* <div className='rounded-2xl hover:brightness-[1.05] cursor-pointer trans w-full p-6 py-[24px] font-semibold flex items-center space-x-4 justify-center bg-gradient-to-tr from-purple-400 to-blue-400 text-white'>
            <EyeIcon className='w-8 h-8 stroke-[2.5]' />
            <span className="text-[26px]">recent game</span>
          </div> */}



        {/* </div> */}
        <div className='flex space-x-4 translate-y-[-24px] w-full'>
          <div className='border-[2px] border-violet-400/50 hover:bg-violet-400/10 trans cursor-pointer rounded-2xl p-4 py-4  w-[33.3%] font-semibold text-violet-400'>
            <div onClick={() => router.push("/puzzles")} className="flex items-center space-x-6">

              <PuzzlePieceIcon className="w-8 h-8 text-violet-300 stroke-[2]" />
              <p className="text-[22px] text-slate-200">puzzles</p>               </div>
          </div>
          <div className='border-[2px] border-violet-400/50 hover:bg-violet-400/10 trans cursor-pointer p-4 py-4 rounded-2xl  w-[33.3%] font-semibold text-violet-400'>
            <div onClick={() => router.push("/bots")}  className="flex items-center space-x-6">

              <CpuChipIcon className="w-8 h-8 text-violet-300 stroke-[2]" />
              <p className="text-[22px] text-slate-200">bots</p>               </div>
          </div>
          <div className='border-[2px]  border-violet-400/50 hover:bg-violet-400/10 trans cursor-pointer rounded-2xl p-4 py-4  w-[33.3%] font-semibold text-violet-400'>
            <div  onClick={() => router.push("/analyze")} className="flex items-center space-x-6">

              <ComputerDesktopIcon className="w-8 h-8 text-violet-300 stroke-[2]" />
              <p className="text-[22px] text-slate-200">analyze</p>               </div>
          </div>

        </div>
        <div className='flex flex-col space-y-6 translate-y-[-24px]'>
          <div className='flex items-center space-x-4 w-full justify-between bg-slate-600 p-4 rounded-t-2xl rounded-b-md'>
            <div className='flex items-center space-x-4'>
              <BookmarkIcon className="w-8 h-8 text-amber-200" />
              <span className='text-[22px] font-semibold text-white'>available lessons</span>
            </div>
            <ChevronDownIcon className='w-6 h-6 text-slate-400 stroke-[2]' />
          </div>
          <div className='w-full grid grid-cols-2 gap-4'>

            <div className='p-5 w-full border-2 border-slate-600 rounded-md flex items-center space-x-4  text-white font-semibold text-xl'>
              <div className='flex space-y-4 flex-col'>
                <div className='flex items-center space-x-4'>
                  <BookOpenIcon className='w-6 h-6' />
                  <span>no lessons currently</span>
                </div>

                <div>
                  <p className='text-slate-400 text-sm'>lessons on vivaan chess will be added soon</p>
                </div>

              </div>
            </div>

            {/* <div className='p-5 w-full border-2 border-slate-600 rounded-md flex items-center space-x-4  text-white font-semibold text-xl'>
              <div className='flex space-y-4 flex-col'>
                <div className='flex items-center space-x-4'>
                  <AcademicCapIcon className='w-6 h-6' />
                  <span>opening princples</span>
                </div>

                <div>
                  <p className='text-slate-400 text-sm'>the best moves to get an advantage at the start of your game</p>
                </div>

              </div>
            </div>

            <div className='p-5 w-full border-2 border-slate-600 rounded-md flex items-center space-x-4  text-white font-semibold text-xl'>
              <div className='flex space-y-4 flex-col'>
                <div className='flex items-center space-x-4'>
                  <KeyIcon className='w-6 h-6' />
                  <span>skillful endgames</span>
                </div>

                <div>
                  <p className='text-slate-400 text-sm'>learn your endgame play and improve your game as a whole</p>
                </div>

              </div>
            </div>

            <div className='p-5 w-full border-2 border-slate-600 rounded-md flex items-center space-x-4  text-white font-semibold text-xl'>
              <div className='flex space-y-4 flex-col'>
                <div className='flex items-center space-x-4'>
                  <TrophyIcon className='w-6 h-6' />
                  <span>finding checkmate</span>
                </div>

                <div>
                  <p className='text-slate-400 text-sm'>beat your opponent and attack the king for checkmate</p>
                </div>

              </div>
            </div> */}

          </div>
        </div>



        {/* <div className='flex w-full items-center'>
          </div> */}
      </div>
    </div>
  );
}

// {/* <div className='flex justify-center items-center space-x-6 w-full'>
//           {/* <Tippy content={
//             <MyCustomTip text={"work in progress"} />
//           }>
//             <div className='w-full flex items-center justify-center rounded-full p-6 py-4 font-bold text-amber-600 bg-amber-300'>
//               <div className="flex items-center space-x-6">

//                 <BookmarkIcon className="w-8 h-8 text-amber-600 stroke-[2]" />

//                 <p className="text-[28px]">Rules</p>
//               </div>

//             </div>
//           </Tippy>

//           <Tippy content={
//             <MyCustomTip text={"work in progress"} />
//           }>

//             <div className='w-full flex items-center justify-center rounded-full p-6 py-4 font-bold text-blue-400 bg-blue-400/10'>
//               <div className="flex items-center space-x-6">

//                 <AcademicCapIcon className="w-8 h-8 text-blue-600 stroke-[2]" />

//                 <p className="text-[28px]">Strats</p>
//               </div>

//             </div>

//           </Tippy> */}
//         </div>

//         <div className='flex justify-center items-center space-x-6 w-full'>
//           <div onClick={() => {
//             createGame()
//           }} className='w-full hover:brightness-[1.1] transition cursor-pointer hover:border-x-transparent hover:scale-[1.03] duration-400 ease-[cubic-bezier(.3,.48,.47,1.48)] flex items-center justify-center rounded-full p-6 font-bold text-blue-600 bg-blue-300'>
//             <div className="flex items-center space-x-6">

//               <SquaresPlusIcon className="w-10 h-10 text-blue-600 stroke-[2]" />

//               <p className="text-[28px]">Create Game</p>
//             </div>
//           </div>

//         </div>
//         <div className='flex justify-center items-center space-x-6'>
//           <Tippy content={
//             <MyCustomTip text={"work in progress"} />
//           }>
//             <div className='bg-blue-400/10 rounded-full p-6 py-4 font-semibold text-blue-400'>
//               <div className="flex items-center space-x-6">

//                 <PuzzlePieceIcon className="w-8 h-8 text-blue-500 stroke-[2]" />

//                 <p className="text-[22px] text-slate-200">Puzzles</p>
//               </div>
//             </div>
//           </Tippy>
//           <Tippy content={
//             <MyCustomTip text={"work in progress"} />
//           }>
//             <div className='bg-blue-400/10 rounded-full p-6 py-4 font-semibold text-blue-400'>
//               <div className="flex items-center space-x-6">

//                 <GlobeEuropeAfricaIcon className="w-8 h-8 text-blue-500 stroke-[2]" />

//                 <p className="text-[22px] text-slate-200">Leaderboard</p>
//               </div>
//             </div>
//           </Tippy>
//           <Tippy content={
//             <MyCustomTip text={"work in progress"} />
//           }>
//             <div className='bg-blue-400/10 rounded-full p-6 py-4 font-semibold text-blue-400'>
//               <div className="flex items-center space-x-6">

//                 <CpuChipIcon className="w-8 h-8 text-blue-500 stroke-[2]" />

//                 <p className="text-[22px] text-slate-200">Bots</p>
//               </div>
//             </div>
//           </Tippy>
//         </div> */}
