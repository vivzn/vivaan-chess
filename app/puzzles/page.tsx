"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import wk from "../../public/matchstick1/wk.png";
import bk from "../../public/matchstick1/bk.png";
import bq from "../../public/matchstick1/bq.png";
import wq from "../../public/matchstick1/wq.png";
import wr from "../../public/matchstick1/wr.png";
import br from "../../public/matchstick1/br.png";
import data from "../../public/puzzles.json";
import bn from "../../public/matchstick1/bn.png";
import wn from "../../public/matchstick1/wn.png";
import bp from "../../public/matchstick1/bp.png";
import wp from "../../public/matchstick1/wp.png";
import bb from "../../public/matchstick1/bb.png";
import wb from "../../public/matchstick1/wb.png";
import Image from "next/image";
import { BellIcon, DocumentTextIcon, PlayIcon, SparklesIcon, ViewColumnsIcon } from "@heroicons/react/24/solid";
import { Chess } from "chess.js";
import { InboxIcon } from "@heroicons/react/24/solid";
import {
  ArrowPathIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

function Page() {
  useEffect(() => { }, []);

  const [chessH, setChessH] = useState<any>();

  useEffect(() => {
    if (typeof window == "undefined") return;
    const resizeHandler = () => {
      if (typeof window == "undefined") return;
      setChessH(window?.innerHeight - 200);
    };

    resizeHandler();

    window?.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);


  const pieces = [
    "wP",
    "wN",
    "wB",
    "wR",
    "wQ",
    "wK",
    "bP",
    "bN",
    "bB",
    "bR",
    "bQ",
    "bK",
  ];

  const pieceComponents: any = {};
  pieces.forEach((piece) => {
    pieceComponents[piece] = ({ squareWidth }: any) => {
      return <img
        className="hover:ring-[6px] ring-black/20 duration-200 ease-in-out"
        src={`/matchstick1/${piece.toLowerCase()}.png`}
        style={{
          width: squareWidth,
          height: squareWidth,
          backgroundSize: "100%",
        }}
      />
    }
  });


  // const [selectedPlay, setSelectedPlay] = useState<any>("w");

  // const [started, setStarted] = useState<boolean>(false);



  const getNew: any = () => {
    const rn = Math.random();
    if (!(data as any)[Math.floor(rn * (data as any).length)].FEN) {
      return getNew() as any;
    } else {
      return (data as any)[Math.floor(rn * (data as any).length)]
    }
  }

  var ranPuzzle = getNew();

  const [currentP, setCurrentP] = useState<any>(ranPuzzle);
  const [game, setGame] = useState<any>(new Chess(ranPuzzle.FEN));
  const [moveN, setMoveN] = useState<any>(0);


  const getData = () => {
    console.log(data);
    // fetch(data as any)
    //   .then((res) => res.json())
    //   .then((resJson) => {
    //     const data = JSON.parse(resJson)
    //     console.log(resJson)
    // })
  };
  useEffect(() => {
    getData();
  }, []);

  const [side, setSide] = useState<any>("w");

  useEffect(() => {
    console.log(currentP);

    const sid = currentP?.FEN?.split(" ")[1].replaceAll(" ", "");
    setSide(sid);
  }, [currentP]);

  function delay(time: any) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  useEffect(() => {
    if (moveN % 2 !== 0) return; //num is odd

    const num = currentP?.Moves?.split(" ")[moveN] as any || "";
    console.log(currentP)
    const rSource = num[0] + num[1];
    const rTarget = num[2] + num[3];
    let gameCopy = game;
    const valid = gameCopy.move({ from: rSource, to: rTarget, promotion: "q" });
    if (valid) {
      delay(500).then(() => {
        setGame(new Chess(gameCopy.fen()));
        setMoveN(moveN + 1);
      });
    }
  }, [moveN]);

  const [hintLvl, setHintLvl] = useState<any>(0);

  const dropPuz = (source: any, target: any) => {
    const num = currentP.Moves.split(" ")[moveN];
    const rSource = num[0] + num[1];
    const rTarget = num[2] + num[3];
    if (source == rSource && target == rTarget) {
      const gameCopy = game;
      const valid = game.move({ from: rSource, to: rTarget });
      if (valid) {
        setGame(new Chess(gameCopy.fen()));
        setHL({});
        setHintLvl(0);
        setAR(null);
      }
      if (moveN + 1 >= currentP.Moves.split(" ").length) {
        toast.success("Puzzle Completed");
        delay(2000).then(() => {
          var ranPuzzle = getNew();
          setCurrentP(ranPuzzle);
          setGame(new Chess(ranPuzzle.FEN));
          setMoveN(0);
          setAR(null);
          setHL({});
          setHintLvl(0);
        });
      } else {
        setMoveN(moveN + 1);
      }
      return true;
    } else {
      toast.error("Wrong move");
      return false;
    }
  };

  const [hl, setHL] = useState<any>({});
  const [ar, setAR] = useState<any>(null);

  return (
    <div className="w-full h-full flex justify-center items-start p-16 y-scroll simpleScroll">
      {/* <Chessboard boardWidth={400}/> */}

      <div className="flex space-x-4 items-center ">
        <div
          style={{ height: chessH + "px" }}
          className="bg-slate-800 w-[250px] p-4 rounded-xl overflow-y-scroll ridScrollbar flex flex-col space-y-4"
        >


          <span className="text-white font-semibold w-full flex space-x-2 p-2 px-4 justify-center bg-slate-700 rounded-full"><span>rated {currentP?.Rating}</span> <span className="text-violet-300">elo</span></span>

          <div className="flex items-center space-x-2 p-2 py-1 rounded-xl border-2 border-white/5">

            <DocumentTextIcon className="w-4 h-4 text-violet-300 font-semibold " /> <span className="text-slate-500 font-semibold">#{currentP?.PuzzleId}</span>
          </div>

          <p className="text-sm text-slate-400 font-semibold self-center">Puzzle Controls</p>
          <h1 className="font-semibold flex items-center space-x-2 text-xl text-white self-center animate-bounce">
            <SparklesIcon className="w-5 h-5"/>
            <span>move as {side == "w" ? "black" : "white"}</span>
          </h1>
          <div className="flex space-x-4 w-full">
            <div
              onClick={() => {
                var ranPuzzle = getNew();
                setCurrentP(ranPuzzle);
                setGame(new Chess(ranPuzzle.FEN));
                setMoveN(0);
                setAR(null);
                setHL({});
                setHintLvl(0);
              }}
              className="p-3 w-1/2 cursor-pointer rounded-full hover:brightness-125 transition duration-200 ease-in-out bg-orange-500 text-orange-100 flex font-semibold justify-center items-center space-x-2"
            >
              <ArrowPathIcon className="w-6 h-6 stroke-[2]" />
              <p>New</p>
            </div>
            <div
              onClick={() => {
                if (hintLvl >= 2) return;

                const num = currentP.Moves.split(" ")[moveN];
                const rSource = num[0] + num[1];
                const rTarget = num[2] + num[3];

                if (hintLvl == 0) {
                  setHL({ [rSource]: { background: "rgba(255,0,0,0.4)" } });
                } else if (hintLvl == 1) {
                  setHL({
                    [rSource]: { background: "rgba(255,0,0,0.4)" },
                    [rTarget]: { background: "rgba(255,0,0,0.4)" },
                  });
                  setAR([
                    [
                      rSource,
                      rTarget
                    ],
                  ]);
                  console.log({
                    [rSource]: { background: "rgba(255,0,0,0.4)" },
                    [rTarget]: { background: "rgba(255,0,0,0.4)" },
                  });
                }
                setHintLvl(hintLvl + 1);
              }}
              className={`p-3 w-1/2 cursor-pointer rounded-full hover:brightness-125 transition duration-200 ease-in-out bg-emerald-500/20 text-emerald-200 flex font-semibold justify-center items-center space-x-2 ${hintLvl >= 2 && "pointer-events-none brightness-50"
                }`}
            >
              <BellIcon className="w-6 h-6 stroke-[2]" />
              <p>Hint</p>
            </div>
          </div>


          {currentP?.OpeningTags && (
            <div className="font-semibold text-sm flex bg-red-400/10 p-4 rounded-2xl flex-col space-y-2 items-center justify-center text-white/40">
              <span className="text-red-400 flex space-x-2 items-center">
                <InboxIcon className="w-5 h-5" /> <p>Openings</p>
              </span>{" "}
              <p className="text-center">
                {currentP?.OpeningTags.replaceAll(" ", ", ").replaceAll(
                  "_",
                  " "
                )}
              </p>
            </div>
          )}
          {currentP?.Themes && (
            <div className="font-semibold text-sm flex bg-blue-400/10 p-4 rounded-2xl flex-col space-y-2 items-center justify-center text-white/40">
              <span className="text-blue-500 flex space-x-2 items-center">
                <ViewColumnsIcon className="w-5 h-5" /> <p>Themes</p>
              </span>{" "}
              <p className="text-center">
                {currentP?.Themes.replaceAll(" ", ", ").replaceAll("_", " ")}
              </p>
            </div>
          )}
          {currentP?.Popularity && (
            <div className="font-semibold text-sm flex bg-green-400/10 p-4 rounded-2xl flex-col space-y-2 items-center justify-center text-white/40">
              <span className="text-green-500 flex space-x-2 items-center">
                <ArrowTrendingUpIcon className="w-5 h-5" /> <p>Popularity</p>
              </span>{" "}
              <div className="text-center flex items-center space-x-1 text-white text-2xl leading-6">
                <p>{currentP?.Popularity}</p>
                <span className="text-sm text-green-500">%</span>
              </div>
            </div>
          )}
          <div></div>


        </div>
        <div className="p-0">
          <Chessboard

            customSquareStyles={{
              ...hl,
            }}
            animationDuration={200}
            showBoardNotation={true}
            customArrowColor="rgba(100, 200, 100, 0.9)"
            customArrows={ar || []}
            customBoardStyle={{ borderRadius: '2px' }} customLightSquareStyle={{ backgroundColor: "#f3f4f6" }} customDarkSquareStyle={{ backgroundColor: "#60a5fa" }} customNotationStyle={{ fontWeight: '800', fontFamily: "satoshi" }}
            boardWidth={chessH || 500}
            customPieces={pieceComponents}
            onPieceDrop={dropPuz}
            boardOrientation={side == "b" ? "white" : "black"}
            snapToCursor
            position={game.fen()}
          />
        </div>
      </div>



    </div>
  );
}

export default Page;

// <p className="text-sm text-neutral-400 font-semibold">Puzzle Controls</p>
//           <h1 className="font-bold text-xl">
//              play {side == "w" ? "black" : "white"}
//           </h1>
//           <div className="flex space-x-4 w-full">
//             <div
//               onClick={() => {
//                 var ranPuzzle = getNew();
//                 setCurrentP(ranPuzzle);
//                 setGame(new Chess(ranPuzzle.FEN));
//                 setMoveN(0);
//                 setAR(null);
//                 setHL({});
//                 setHintLvl(0);
//               }}
//               className="p-3 w-1/2 cursor-pointer rounded-full hover:brightness-125 transition duration-200 ease-in-out bg-orange-500 text-orange-100 flex font-semibold justify-center items-center space-x-2"
//             >
//               <ArrowPathIcon className="w-6 h-6 stroke-[2]" />
//               <p>New</p>
//             </div>
//             <div
//               onClick={() => {
//                 if (hintLvl >= 2) return;

//                 const num = currentP.Moves.split(" ")[moveN];
//                 const rSource = num[0] + num[1];
//                 const rTarget = num[2] + num[3];

//                 if (hintLvl == 0) {
//                   setHL({ [rSource]: { background: "rgba(255,0,0,0.4)" } });
//                 } else if (hintLvl == 1) {
//                   setHL({
//                     [rSource]: { background: "rgba(255,0,0,0.4)" },
//                     [rTarget]: { background: "rgba(255,0,0,0.4)" },
//                   });
//                   setAR([
//                     [
//                       rSource,
//                       rTarget
//                     ],
//                   ]);
//                   console.log({
//                     [rSource]: { background: "rgba(255,0,0,0.4)" },
//                     [rTarget]: { background: "rgba(255,0,0,0.4)" },
//                   });
//                 }
//                 setHintLvl(hintLvl + 1);
//               }}
//               className={`p-3 w-1/2 cursor-pointer rounded-full hover:brightness-125 transition duration-200 ease-in-out bg-emerald-500/20 text-emerald-200 flex font-semibold justify-center items-center space-x-2 ${
//                 hintLvl >= 2 && "pointer-events-none brightness-50"
//               }`}
//             >
//               <BellIcon className="w-6 h-6 stroke-[2]" />
//               <p>Hint</p>
//             </div>
//           </div>

// // <div
// //           style={{ height: chessH + "px" }}
// //           className="bg-slate-800 w-[250px] p-4 rounded-xl flex flex-col space-y-2 items-center"
// //         >
// //          <div className="p-2 rounded-full border-slate-600"></div>
// //           <h1 className="font-semibold text-md text-neutral-400">
// //             ID #{currentP?.PuzzleId} -{" "}
// //             <span className="text-white">{currentP?.Rating} elo</span>
// //           </h1>
// //           {currentP?.OpeningTags && (
// //             <div className="font-semibold text-sm flex flex-col space-y-2 items-center justify-center text-neutral-400">
// //               <span className="text-red-500 flex space-x-2 items-center">
// //                 <InboxIcon className="w-5 h-5" /> <p>Openings</p>
// //               </span>{" "}
// //               <p className="text-center">
// //                 {currentP?.OpeningTags.replaceAll(" ", ", ").replaceAll(
// //                   "_",
// //                   " "
// //                 )}
// //               </p>
// //             </div>
// //           )}
// //           {currentP?.Themes && (
// //             <div className="font-semibold text-sm flex flex-col space-y-2 items-center justify-center text-neutral-400">
// //               <span className="text-blue-500 flex space-x-2 items-center">
// //                 <ViewColumnsIcon className="w-5 h-5" /> <p>Themes</p>
// //               </span>{" "}
// //               <p className="text-center">
//                 {currentP?.Themes.replaceAll(" ", ", ").replaceAll("_", " ")}
//               </p>
//             </div>
//           )}
//           {currentP?.Popularity && (
//             <div className="font-semibold text-sm flex flex-col space-y-2 items-center justify-center text-neutral-400">
//               <span className="text-green-500 flex space-x-2 items-center">
//                 <ArrowTrendingUpIcon className="w-5 h-5" /> <p>Popularity</p>
//               </span>{" "}
//               <div className="text-center flex items-center space-x-1 text-white text-2xl leading-6">
//                 <p>{currentP?.Popularity}</p>
//                 <span className="text-sm text-green-500">%</span>
//               </div>
//             </div>
//           )}
//           <div></div>
//           <hr className="w-full border-neutral-500" />

//           <div></div>
//           <p className="text-sm text-neutral-400 font-semibold">Puzzle Controls</p>
//           <h1 className="font-bold text-xl">
//              play {side == "w" ? "black" : "white"}
//           </h1>
//           <div className="flex space-x-4 w-full">
//             <div
//               onClick={() => {
//                 var ranPuzzle = getNew();
//                 setCurrentP(ranPuzzle);
//                 setGame(new Chess(ranPuzzle.FEN));
//                 setMoveN(0);
//                 setAR(null);
//                 setHL({});
//                 setHintLvl(0);
//               }}
//               className="p-3 w-1/2 cursor-pointer rounded-full hover:brightness-125 transition duration-200 ease-in-out bg-orange-500 text-orange-100 flex font-semibold justify-center items-center space-x-2"
//             >
//               <ArrowPathIcon className="w-6 h-6 stroke-[2]" />
//               <p>New</p>
//             </div>
//             <div
//               onClick={() => {
//                 if (hintLvl >= 2) return;

//                 const num = currentP.Moves.split(" ")[moveN];
//                 const rSource = num[0] + num[1];
//                 const rTarget = num[2] + num[3];

//                 if (hintLvl == 0) {
//                   setHL({ [rSource]: { background: "rgba(255,0,0,0.4)" } });
//                 } else if (hintLvl == 1) {
//                   setHL({
//                     [rSource]: { background: "rgba(255,0,0,0.4)" },
//                     [rTarget]: { background: "rgba(255,0,0,0.4)" },
//                   });
//                   setAR([
//                     [
//                       rSource,
//                       rTarget
//                     ],
//                   ]);
//                   console.log({
//                     [rSource]: { background: "rgba(255,0,0,0.4)" },
//                     [rTarget]: { background: "rgba(255,0,0,0.4)" },
//                   });
//                 }
//                 setHintLvl(hintLvl + 1);
//               }}
//               className={`p-3 w-1/2 cursor-pointer rounded-full hover:brightness-125 transition duration-200 ease-in-out bg-emerald-500/20 text-emerald-200 flex font-semibold justify-center items-center space-x-2 ${
//                 hintLvl >= 2 && "pointer-events-none brightness-50"
//               }`}
//             >
//               <BellIcon className="w-6 h-6 stroke-[2]" />
//               <p>Hint</p>
//             </div>
//           </div>
//         </div>