"use client";
import { pusherClient } from "@/pusherConfig";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import path from "path";
import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios'
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { nanoid } from "nanoid";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { ArrowDownIcon, ArrowsPointingOutIcon, ArrowsUpDownIcon, ChatBubbleOvalLeftIcon, CheckIcon, FlagIcon, PaperClipIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Bars3BottomLeftIcon, BoltIcon, BoltSlashIcon, FlagIcon as FlagIconSolid, SpeakerWaveIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import Tippy from "@tippyjs/react";
import MyCustomTip from "@/components/mycustomtip";
import useSWR from "swr";
import WaitForRival from "@/components/waitForRival";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { RootContext } from "@/context";
import toast from "react-hot-toast";

enum playerEnum {
  Loader,
  Error,
  PlayerW,
  PlayerB,
  Spectator
}

export default function Game() {
  const pathname = useParams().id as string;
  const [game, setGame] = useState<any>({ main: new Chess() });
  const [moveList, setMoveList] = useState<any[]>([]);
  const [playerState, setPlayerState] = useState<playerEnum>(playerEnum.Loader);
  const [user, setUser] = useContext<any>(RootContext).user;
  const [opponent, setOpponent] = useState<any>();
  const [msg, setMsg] = useState<any>("");
  const [msgList, setMsgList] = useState<any>([])



  const fetcher = (url: any) => axios.post('/api/get-game', { _id: pathname }).then((data: any) => data)

  const { data, error, isLoading } = useSWR(`/api/get-game`, fetcher, {
    refreshInterval: 1000,
    dedupingInterval: 1000,
  });




  // const { data, error, isLoading } = useSWR('/api/user', fetcher)

  const addSessionID = (data: any, sessionID: number) => {
    return { data, sessionID }
  }



  useEffect(() => {
    setMoveList(data?.data?.moves);
  }, [data?.data?.moves]),

    useEffect(() => {
      if (data?.data?.members && data?.data?.members.length === 2 && user?.email && !opponent) {
        const opponentUser: any = data?.data?.members.find((member: any) => member.user !== user?.email).user;
        if (opponentUser) {
          axios.post('/api/get-user', { email: opponentUser }).then((data: any) => {
            if (data?.data) {
              // console.log("OPPONENT", data?.data)
              setOpponent(data?.data)
            } else {

            }
          })
        }
      }
    }, [data?.data?.members])


  useEffect(() => {
    setGame({ main: new Chess(data?.data?.fen) });
  }, [data?.data?.fen]),


    useEffect(() => {

      if (!user) return;
      axios.post('/api/get-game', { _id: pathname }).then((data: any) => {
        if (data?.data) {
          // if(!user) return;/
          const gData = data?.data;
          const members = gData.members;
          // console.log(members.length)
          // console.log(members)

          let over = false;

          members.forEach((member: any) => {
            // console.log(member.user, user?.email)
            if (member.user === user?.email) {
              // console.log(member?.side == "w" ? playerEnum.PlayerW : playerEnum.PlayerB)
              setPlayerState(member?.side == "w" ? playerEnum.PlayerW : playerEnum.PlayerB);
              over = true;
              return;
            }
          })

          if (over) return;

          if (members.length >= 2) {
            setPlayerState(playerEnum.Spectator)
            return;
          }



          if (members.length === 1) {
            const otherMember = members[0];
            // if(!otherMember) return;

            // if(otherMember.user === user?.email) {
            //   setPlayerState(otherMember?.side == "w" ? playerEnum.PlayerW : playerEnum.PlayerB);
            //   return;
            // }

            // if(!user) {
            //   return;
            // }

            if (otherMember.side === "w") {
              setPlayerState(playerEnum.PlayerB)
              // console.log(user)
              axios.post('/api/update-game', {
                _id: pathname, update: {
                  members: [...members, {
                    user: user?.email,
                    side: "b"
                  }],
                  gameStatus: "playing",
                }
              }).then((data: any) => {
                // console.log("YOU are added as W")
              })
            } else {
              setPlayerState(playerEnum.PlayerW)
              // console.log(user)
              axios.post('/api/update-game', {
                _id: pathname, update: {
                  members: [...members, {
                    user: user?.email,
                    side: "w"
                  }],
                  gameStatus: "playing",
                }
              }).then((data: any) => {
                // console.log("YOU are added as B")
              })
            }
          }
          // setPlayerState(playerEnum.PlayerW);

        } else {
          setPlayerState(playerEnum.Error)
        }
      }).catch(() => {
        setPlayerState(playerEnum.Error)
      })
    }, [user])

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

  const [stopShowing, setStopShowing] = useState(false);

  useEffect(() => {
    if (!gameModule && data?.data?.winner) {
      setGameModule(data?.data?.winner)
    }
  }, [data?.data?.winner])

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

  //

  const [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    pusherClient.subscribe(pathname as string)

    const moveHandler = (data: any) => {

      if (data?.sessionID === pusherClient?.sessionID) {
        //it is the same user dont do anything
      } else {
        if (data?.data) {
          // console.log('SAN GIVEN', data?.data?.san)
          const move_ = {
            from: data?.data?.from,
            to: data?.data?.to,
            promotion: data?.data?.promotion,
            san: data?.data?.san,
            color: data?.data?.color,
            piece: data?.data?.piece,
          }

          setMoveList((ml) => [...ml, move_])


          setGame({ main: new Chess(data?.data?.fen) })
        }
      }



    }

    pusherClient.bind('move', moveHandler)

    const msgHandler = (data: any) => {


      if (!data) return;
      setMsgList((ml: any) => [...ml, data])



    }

    pusherClient.bind('msg', msgHandler)

    const drawHandler = (data: any) => {

      if (data?.sessionID == pusherClient.sessionID) {

      } else {
        if (data?.data) {
          const toastId = toast.custom(
            <div className="bg-slate-600 p-4 flex items-center space-y-4 flex-col rounded-md text-black">
              <p className="text-slate-300">
                <span className="font-semibold">{opponent?.name}</span> asked for
                draw
              </p>
              <div className="flex space-x-4 items-center">
                <button
                  onClick={() => toast.dismiss(toastId)}
                  className="px-6 p-2 bg-red-400 ease-in-out transition-all duration-200 rounded-xl"
                >
                  <XMarkIcon className="w-6 h-6 stroke-[2.5] text-white" />
                </button>
                <button
                  onClick={async () => {
                    toast.dismiss(toastId);

                    setGameModule({
                      method: "draw",
                      winnner: "-",
                    });

                    if (data?.data?.gameStatus == "finished") return;

                    axios.post('/api/update-game', {
                      _id: pathname, update: {
                        winner: {
                          winner: "-",
                          method: "draw",
                        },
                        gameStatus: "finished",
                      }
                    }).then((data: any) => {
                      // console.log("YOU are added as W")
                    })

                    // const ended = await fetchEditGame({
                    //   ended: {
                    //     endedBy: "Draw",
                    //     wonBy: "-",
                    //   },
                    // });
                  }}
                  className="px-6 p-2 bg-green-400 ease-in-out transition-all duration-200 rounded-xl"
                >
                  <CheckIcon className="w-6 h-6 stroke-[2.5] text-white" />
                </button>
              </div>
            </div>,
            { position: "bottom-center", duration: 5000 }
          );
        }
      }

    }

    pusherClient.bind('draw', drawHandler)

    return () => {
      pusherClient.unsubscribe(pathname as string)
      pusherClient.unbind('msg', msgHandler);
      pusherClient.unbind('draw', drawHandler);
      pusherClient.unbind('move', moveHandler);
    }
  }, []);

  const sendMove = async (text: any, roomId: string, channel: string) => {
    await axios.post('/api/msg', { text, roomId, channel })
  }
  const dropPiece = async (from: string, to: string, piece: undefined | null | string) => {
    if (playerState !== playerEnum.PlayerW && playerState !== playerEnum.PlayerB) return false;
    if (piece && piece[0] !== (playerState == playerEnum.PlayerW ? "w" : "b")) return false;

    const gameCopyable = game?.main;
    const move_ = {
      from,
      to,
      promotion: (piece as string)[1].toLowerCase() ?? "q",
    }

    const move = gameCopyable.move(move_);
    // console.log(move)
    setGame({ main: gameCopyable })


    // console.log(addSessionID(move_, pusherClient?.sessionID), pathname, "move")

    if (!move) return false;


    const move__ = {
      from,
      to,
      promotion: (piece as string)[1].toLowerCase() ?? "q",
      san: move?.san,
      color: move?.color,
      piece: move?.piece,
    }

    // console

    setMoveList((ml) => [...ml, move__])


    await sendMove(addSessionID({ ...move_, fen: gameCopyable.fen(), san: move?.san, color: move?.color, piece: move?.piece }, pusherClient?.sessionID), pathname, "move");

    axios.post('/api/update-game', {
      _id: pathname, update: {
        moves: [...data?.data?.moves, move__],
        fen: gameCopyable.fen(),
      }
    }).then((data: any) => {
      // console.log("added move LIST")
    })

    return true;
  }

  const [gameModule, setGameModule] = useState<any>(null);

  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const [isCooldown, setIsCooldown] = useState<any>(false);
  const giveEmElo = () => {
    const blackGets = "b" == game?.main?.turn() ? -getRandomNumber(8, 12) : getRandomNumber(8, 12);
    const whiteGets = "w" == game?.main?.turn() ? -getRandomNumber(8, 12) : getRandomNumber(8, 12);
    const blackIs = data?.data?.members?.filter((member: any) => member.side == "b")[0].user;
    const whiteIs = data?.data?.members?.filter((member: any) => member.side == "w")[0].user;

    
    const iduje= toast.loading("changing players trophies");

    axios.post('/api/update-user', {
      email: whiteIs, increment: whiteGets
    }).then((d) => {
      axios.post('/api/update-user', {
        email: blackIs, increment: blackGets
      })
    })

    toast.dismiss(iduje);

    toast.success("player trophies have been updated")
  }
  useEffect(() => {
    if (game?.main) {
      if (game.main?.isCheckmate()) {
        setGameModule({
          method: "checkmate",
          winnner: game.main.turn() === "w" ? "b" : "w",
        });

        if (data?.data?.gameStatus == "finished") return;

        axios.post('/api/update-game', {
          _id: pathname, update: {
            winner: {
              winner: game.main.turn() === "w" ? "b" : "w",
              method: "checkmate",
            },
            gameStatus: "finished",
          }
        }).then((data: any) => {
          // console.log("YOU are added as W")
          // if(data?.winner?.)
          giveEmElo();
        })
      }



      if (game.main?.isInsufficientMaterial()) {
        setGameModule({
          method: "insufficientMaterial",
          winnner: "-",
        });

        if (data?.data?.gameStatus == "finished") return;

        axios.post('/api/update-game', {
          _id: pathname, update: {
            winner: {
              winner: "-",
              method: "insufficientMaterial",
            },
            gameStatus: "finished",
          }
        }).then((data: any) => {
          // console.log("YOU are added as W")
        })
      }

      if (game?.main?.isStalemate()) {
        setGameModule({
          method: "stalemate",
          winnner: "-",
        });

        if (data?.data?.gameStatus == "finished") return;

        axios.post('/api/update-game', {
          _id: pathname, update: {
            winner: {
              winner: "-",
              method: "stalemate",
            },
            gameStatus: "finished",
          }
        }).then((data: any) => {
          // console.log("YOU are added as W")
        })
      }
    }
  }, [game?.main])

  function determinePiece(piece: string, color: string) {
    const pieceMade = piece + color;
    // console.log(pieceMade)
    if (pieceMade == "pw") return "♟"
    if (pieceMade == "pb") return "♙"
    if (pieceMade == "bw") return "♝"
    if (pieceMade == "bb") return "♗"
    if (pieceMade == "qw") return "♛"
    if (pieceMade == "qb") return "♕"
    if (pieceMade == "kw") return "♚"
    if (pieceMade == "kb") return "♔"
    if (pieceMade == "nw") return "♞"
    if (pieceMade == "nb") return "♘"
    if (pieceMade == "rw") return "♜"
    if (pieceMade == "rb") return "♖"


    return ""
  }

  if (playerState == playerEnum.Loader) {
    return <Loading fit={true} />
  }

  if (playerState == playerEnum.Error) {
    return <Error fit={true} />
  }

  const submitMsg = async (e: any) => {
    e.preventDefault();
    setMsg("")



    await axios.post('/api/msg', {
      text: {
        user: user?.email,
        text: msg
      }, roomId: pathname, channel: "msg"
    })

  }


  return (
    <div className="w-full h-screen flex flex-grow-[1]">
     
      {showScroll && <div id="scroller" className="w-8 h-8 rounded-full bottom-0 bg-white z-[10] grid place-content-center absolute ml-4 mb-2 shadow-2xl animate-bounce">
        <ArrowDownIcon className="w-5 h-5 stroke-[3] text-violet-400" />

        <p className="absolute font-bold text-white w-[200px] space-x-1 ml-[38px] mt-[px] bg-slate-600 rounded-full p-1 justify-center flex">
          <span>scroll down to chat</span>
          <XMarkIcon onClick={() => setShowScroll(false)} className="w-6 hover:scale-110 cursor-pointer h-6 stroke-[2.5] text-slate-400" />
        </p>
      </div>}
      <div className="w-[61%] h-full flex flex-col overflow-auto simpleScroll">

        <div className="w-full h-full bg-slate-900 p-6 grid place-content-center space-x-3">
          {(gameModule?.winner && !stopShowing) && (
            <div className="w-screen h-screen bg-black/20 absolute inset-0 z-50 grid place-content-center">
              <div className="p-8 flex flex-col space-y-4 rounded-2xl bg-slate-600">
                <p className="text-white font-bold text-3xl flex items-center space-x-2">
                  <BoltIcon className="w-7 h-7" />
                  <span>  {gameModule.method}</span>
                </p>
                {gameModule.winner == "-" ? (<p className="font-semibold text-slate-300 text-2xl">damn no one won</p>) : <p className="font-semibold text-slate-300 text-2xl">{gameModule?.winner == "w" && "white won"}{gameModule?.winner == "b" && "black won"}{gameModule?.winner == "-" && "no winner"}</p>}
                <XMarkIcon onClick={() => setStopShowing(true)} className="h-8 cursor-pointer text-white stroke-[2.5] flex items-center justify-center p-2 rounded-full bg-black/20 w-full" />
              </div>
            </div>
          )}
          <Chessboard animationDuration={0} boardOrientation={playerState == playerEnum.PlayerB ? "black" : "white"} position={game?.main?.fen()} onPieceDrop={dropPiece as any} boardWidth={500} customPieces={pieceComponents} customBoardStyle={{ borderRadius: '2px', boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }} customLightSquareStyle={{ backgroundColor: "#f3f4f6" }} customDarkSquareStyle={{ backgroundColor: "#60a5fa" }} customNotationStyle={{ fontWeight: '800', fontFamily: "satoshi" }} />
          {/* <div className="w-full h-[500px] space-y-2 ridScrollbar overflow-y-scroll">
            {(moveList?.map((txt: any, index: any) => {
              console.log(txt)

              return <div key={index} className="font-semibold">{((index + 1 + 1) % 2 == 0) && (
                <div className={`w-full h-fit px-[8x] space-x-3 p-[8px] leading-3 flex flex-grow-[1] items-center rounded-full`}>
                  <div className="text-[13px] text-slate-400">{(index + 2) / 2}.</div>
                  <div className="h-full w-full space-x-2 pr-2 flex font-semibold">
                    {txt && <div key={txt?.san} className="w-[50%] min-w-[50%] max-w-[50%] bg-white/3 h-[20px] flex items-center px-[8px] space-x-1 text-slate-300 border-l-px] border-slate-400/20">
                      {determinePiece(txt?.piece, txt?.color)}
                      <span className="" style={{ fontSize: txt?.san?.length > 4 ? ("10px") : ("14px") }}>{txt?.san}</span>
                    </div>}




                    {(moveList[index + 1] && <div key={moveList[index + 1]?.san} className="w-[50%] min-w-[50%] max-w-[50%] bg-white/3 h-[20px] flex items-center px-[8px] space-x-1 text-slate-300 border-l-px] border-slate-400/20">
                      {determinePiece(moveList[index + 1]?.piece, moveList[index + 1]?.color)}
                      <span className="" style={{ fontSize: "14" + "px" }}>{(moveList[index + 1]?.san)}</span>
                    </div>)}



                  </div>
                </div>
              )}</div>
            }))}


            {moveList.length == 0 && (
              <div className={`w-full h-fit px-[8x] space-x-3 p-[8px] leading-3 flex flex-grow-[1] items-center rounded-full`}>
                <div className="text-[13px] text-slate-400">1.</div>
                <div className="h-full w-full space-x-2 pr-2 flex font-semibold">
                  <div className="w-[100%] min-w-[100%] max-w-[100%] bg-white/3 h-[20px] flex items-center text-slate-300 border-l-px] border-slate-400/20">

                    <span>not played</span>


                  </div>
                </div>
              </div>)


            }

          </div> */}
        </div>
        <div className="w-full h-full flex-col flex-grow-[1] ">

          <div className="w-full h-full flex flex-col flex-grow-[1]">



            <div className="flex p-4 border-b-2 border-r-2 border-white/5 space-x-2 justify-between">
              <div className="flex space-x-6 items-center">
                <SpeakerWaveIcon className="w-6 h-6 text-white" />
                <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowsPointingOutIcon className="w-6 h-6 text-white stroke-[2]" />
            </div>




            <div className="w-full h-full flex items-center border-r-2 border-white/5 justify-center space-x-4 p-4">
              {data?.data?.gameStatus == "playing" || data?.data?.gameStatus == "finished" ? <>
                {data?.data?.gameStatus == "playing" && <Tippy content={<MyCustomTip text={"resign"} />}>
                  <div onClick={async () => {
                    let yesOrNo = window.confirm("Are you sure you want to resign?")

                    if (yesOrNo) {
                      setGameModule({
                        winner: (playerState == playerEnum.PlayerB) ? "w" : "b",
                        method: "resign",
                      })
                      axios.post('/api/update-game', {
                        _id: pathname, update: {
                          winner: {
                            winner: (playerState == playerEnum.PlayerB) ? "w" : "b",
                            method: "resign",
                          },
                          gameStatus: "finished",
                        }
                      }).then((data: any) => {
                        // console.log("YOU are added as W")
                        giveEmElo();
                      })
                    }
                  }} className="bg-red-500 text-white font-semibold  trans hover:brightness-90 text-[18px] space-x-4 p-4 items-center justify-center flex trans rounded-full trans cursor-pointer">
                    {/* <FlagIcon className="w-4 h-4 text-red-200 rotate-[15deg] stroke-[2.5]" /> */}
                    <FlagIconSolid className="w-6 h-6 text-white rotate-[15deg] stroke-[2.5]" />
                    <span>resign</span>
                    {/* <FlagIcon className="w-4 h-4 text-red-200 rotate-[15deg] stroke-[2.5]" /> */}

                  </div>
                </Tippy>}
                {data?.data?.gameStatus == "playing" && <Tippy content={<MyCustomTip text={"ask for draw"} />}>
                  <button onClick={async () => {
                    if (!isCooldown) {
                      // Send the request here
                      toast.success("you have sent a draw request")
                      await sendMove({ data: "draw", sessionID: pusherClient?.sessionID }, pathname, "draw");

                      // Set the cooldown to true
                      setIsCooldown(true);

                      // Reset the cooldown after 15 seconds
                      setTimeout(() => {
                        setIsCooldown(false);
                      }, 15000);
                    }
                  }} disabled={isCooldown} className="bg-amber-500 disabled:brightness-[0.7] disabled:cursor-default text-white trans hover:brightness-90 font-semibold text-[18px] space-x-4 p-4 items-center justify-center flex trans rounded-full trans cursor-pointer">
                    {/* <FlagIcon className="w-4 h-4 text-red-200 rotate-[15deg] stroke-[2.5]" /> */}
                    <ArrowsUpDownIcon className="w-6 h-6 text-white stroke-[2.5]" />
                    <span>draw?</span>
                    {/* <FlagIcon className="w-4 h-4 tex    t-red-200 rotate-[15deg] stroke-[2.5]" /> */}

                  </button>
                </Tippy>}

                {data?.data?.gameStatus == "finished" && (
                  <div className="bg-slate-600 text-white font-semibold text-[18px] space-x-4 p-4 items-center justify-center flex trans rounded-full trans">
                    {/* <FlagIcon className="w-4 h-4 text-red-200 rotate-[15deg] stroke-[2.5]" /> */}
                    <XCircleIcon className="w-6 h-6 text-white stroke-[2.5]" />
                    <span>this game has ended</span>
                    {/* <FlagIcon className="w-4 h-4 text-red-200 rotate-[15deg] stroke-[2.5]" /> */}

                  </div>
                )}

              </> : (
                <>
                  <WaitForRival />
                </>
              )}
            </div>
            <div className="w-full p-4 pt-0 border-r-2 border-white/5">
              <div className="w-full h-full max-h-full flex flex-col flex-grow-[1] p-4 space-y-4 border-2 border-white/5 rounded-xl">  <div className="w-full h-fit flex-grow-[1] rounded-full flex space-x-4 p-3 placeholder:font-semibold font-semibold bg-slate-600"> <ChatBubbleOvalLeftIcon className="w-6 h-6 stroke-[2.5] text-slate-300" /> <form className="w-full" onSubmit={submitMsg}> <input onChange={(e) => setMsg(e?.target.value)} value={msg} className="bg-transparent focus:outline-none outline-none text-white w-full h-full" placeholder="game chat" /> </form> </div> <div className="w-full h-[150px] overflow-y-scroll simpleScroll space-y-2"> {msgList && msgList.map((msg: any, index: any) => (<div key={index} className="space-x-[8px] w-full h-fit"> <span className="font-semibold text-white">{msg?.user}:</span> <span className="font-semibold text-slate-400">{msg?.text}</span> </div>))} </div> </div>
            </div>
          </div>

        </div>
      </div>
      <div className="w-[39%] h-full bg-slate-700">
        <div className="w-full h-[39%] border-b-2  border-white/5 flex flex-col flex-grow-[1]">
          <div className="p-4 flex w-full justify-center bg-slate-700 border-white/5 border-b-2">
            {(playerState == playerEnum.PlayerB || playerState == playerEnum.PlayerW) && <div className="text-white font-bold flex space-x-4 items-center">
              <div className={`w-5 h-5 rounded-[4px] ${playerState == playerEnum.PlayerW ? "bg-white" : "bg-black"}`}>
              </div>
              <span className="text-white">you {playerState == playerEnum.PlayerW ? "play white" : "play black"}</span>

            </div>}
          </div>
          <div className="w-full h-full flex flex-col">
            {data?.data?.gameStatus == "waiting" ? <div className="w-full h-full grid place-content-center p-4">
              <WaitForRival />
            </div> : (
              <div className="flex flex-col w-full h-full">
                <div className="flex w-full h-full items-center justify-center space-x-4 p-4 border-white/5  bg-slate-800">
                  {/* <span className="font-bold text-slate-200">playing</span> */}



                  <fieldset className="flex translate-y-[-7px] items-center gap-4 p-4 pt-2 rounded-xl bg-slate-700">
                    <legend className="font-bold text-white">playing</legend>
                    <div className="absolute translate-x-[-30px] translate-y-[-46px] text-bold items-center text-violet-400 space-x-2 flex">
                      <BoltIcon className="w-7 h-7 text-violet-400" />

                    </div>
                    <Image alt="opponent" width={50} className="rounded-full border-slate-white/5" height={50} src={opponent?.photoURL} />
                    <div className="flex flex-col space-y-1">

                      <span className="text-slate-300 font-bold leading-4 flex space-x-4"><span className="text-violet-300">{opponent?.elo}</span><span>{opponent?.name?.toLowerCase()}</span></span>
                      <span className="text-slate-500 font-semibold">{opponent?.email}</span>

                    </div>
                  </fieldset>
                </div>

              </div>
            )}

          </div>


        </div>
        <div className="w-full h-[61%] flex">

          <div className="w-[100%] h-full border-white/5 border-r-2 p-4">
            <div className="w-full h-full simpleScroll space-y-2 overflow-y-scroll simpleScroll">
              {(moveList?.map((txt: any, index: any) => {

                return <div key={index} className="font-semibold">{((index + 1 + 1) % 2 == 0) && (
                  <div className={`w-full h-fit px-[8x] space-x-3 p-[8px] leading-3 flex flex-grow-[1] items-center rounded-full`}>
                    <div className="text-[13px] text-slate-400">{(index + 2) / 2}.</div>
                    <div className="h-full w-full space-x-2 pr-2 flex font-semibold">
                      {txt && <div key={txt?.san} className="w-[50%] min-w-[50%] max-w-[50%] bg-white/3 h-[20px] flex items-center px-[8px] space-x-1 text-slate-300 border-l-px] border-slate-400/20">
                        {determinePiece(txt?.piece, txt?.color)}
                        <span className="text-[16px]">{txt?.san?.toLowerCase()}</span>
                      </div>}




                      {((moveList && moveList[index + 1]) && <div key={moveList[index + 1]?.san} className="w-[50%] min-w-[50%] max-w-[50%] bg-white/3 h-[20px] flex items-center px-[8px] space-x-1 text-slate-300 border-l-px] border-slate-white/5">
                        {determinePiece(moveList[index + 1]?.piece, moveList[index + 1]?.color)}
                        <span className="" style={{ fontSize: "16" + "px" }}>{(moveList[index + 1]?.san?.toLowerCase())}</span>
                      </div>)}



                    </div>
                  </div>
                )}</div>
              }))}


              {moveList?.length == 0 && (
                <div className={`w-full h-fit px-[8x] space-x-3 p-[8px] leading-3 flex flex-grow-[1] items-center rounded-full`}>
                  <div className="text-[13px] text-slate-400">1.</div>
                  <div className="h-full w-full space-x-2 pr-2 flex font-semibold">
                    <div className="w-[100%] min-w-[100%] max-w-[100%] h-[20px] flex items-center text-slate-300">

                      <span>not played</span>


                    </div>
                  </div>
                </div>)


              }

            </div>
          </div>

        </div>

      </div>


    </div>
  );
}
