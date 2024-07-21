"use client";

import { ArrowUturnLeftIcon, ArrowUturnRightIcon, ChevronDownIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { BoltIcon } from '@heroicons/react/24/solid';
import { Chess } from 'chess.js';
import { useDebugValue, useEffect, useMemo, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';


export default function Analyze() {
    const [positions, setPositions] = useState<any>();
    const [game, setGame] = useState<any>({ main: new Chess() })

    const [evalMoves, setEvalMoves] = useState<any>();
    const [bMove, setBMove] = useState<string>("");

    const lozza: any = useMemo(() => typeof window !== "undefined" && new Worker("/stockfish.js"), []);
    useEffect(() => {

        lozza.postMessage("uci"); // lozza uses the uci communication protocols
        // lozza.postMessage(`setoption MultiPv value 3`);

        setEvalMoves([]);
        setBMove("");

        // console.log(positions)
        lozza.postMessage("setoption name MultiPv value 3")
        lozza.postMessage(`position fen ${game?.main?.fen()}`);
        lozza.postMessage(`go depth 14`);


        lozza.onmessage = (event: any) => {
            const line = event.data;


            if (line.startsWith("best")) {
                setBMove(line)
            }
            if (!line.startsWith("info depth 14")) return;

            const getBestMoves = (line: string) => {
                const movesData = line.split("pv")[2].replace(" ", "").substring(0, 15);
                const cpData = line.split("cp ")[1].split(" ")[0]
                // const bestMoves = [];



                return { moves: movesData, cpData: cpData };
            };

            const bestNext3Moves = getBestMoves(line);
            if (evalMoves?.includes(bestNext3Moves)) {
                return;
            } else {
                setEvalMoves((old: any) => [...old, bestNext3Moves]);
                console.log(bestNext3Moves)
            }

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

    return (
        <div className='w-full h-full p-8 flex flex-col items-center'>
            <div className='flex space-x-4'>
                {/* {evalMoves[0].moves} */}
                <div>
                    <Chessboard customArrows={[]} onPieceDrop={(from, to, piece) => {
                        let gameCopy = game?.main;;

                        if (gameCopy.move({
                            from, to, promotion: (piece as string)[1].toLowerCase() ?? "q",

                        })) {
                            setGame({ main: gameCopy });
                            let positions: any[] = [];
                            gameCopy?.history({ verbose: true }).forEach((m: any) => {


                                let moveUCI = m?.from + m?.to;

                                positions.push({
                                    fen: m?.after,
                                    move: {
                                        san: m?.san,
                                        uci: moveUCI,
                                    }
                                })




                            })

                            setEvalMoves([]);
                            setBMove("");

                            // console.log(positions)
                            lozza.postMessage("setoption name MultiPv value 3")
                            lozza.postMessage(`position fen ${game?.main?.fen()}`);
                            lozza.postMessage(`go depth 14`);
                            return true;
                        }
                        return false;
                    }} position={game?.main?.fen()} boardWidth={400} animationDuration={200}
                    showBoardNotation={true}
                    customArrowColor="rgba(100, 200, 100, 0.9)"
                    // customArrows={ar || []}
                    customBoardStyle={{ borderRadius: '2px' }} customLightSquareStyle={{ backgroundColor: "#f3f4f6" }} customDarkSquareStyle={{ backgroundColor: "#60a5fa" }} customNotationStyle={{ fontWeight: '800', fontFamily: "satoshi" }}
                    // boardWidth={chessH || 500}
                    customPieces={pieceComponents} />
                </div>
                
                <div className='bg-slate-800 w-[300px] h-[400px] overflow-y-scroll ridScrollbar p-4 rounded-xl flex flex-col space-y-3 '>
                    <span className='font-semibold text-white flex items-center space-x-3'>
                        <CpuChipIcon className='w-5 h-5 stroke-[2] text-violet-300' />
                        <span>stockfish.js</span>
                    </span>
                    <div className='w-full flex space-x-4'>
                        <button onClick={() => {
                            let gameCopy = game?.main;
                            gameCopy.undo();
                            setGame({ main: gameCopy });
                            setEvalMoves([]);
                            setBMove("");

                             // console.log(positions)
                             lozza.postMessage("setoption name MultiPv value 3")
                             lozza.postMessage(`position fen ${gameCopy?.fen()}`);
                             lozza.postMessage(`go depth 14`);
                            //  return true;
                        }} className='p-2 w-full font-semibold space-x-3 bg-slate-700 justify-center flex rounded-xl'><ArrowUturnLeftIcon className='w-6 stroke-[2.5] h-6 text-white'/> <span className="text-white">undo move</span></button>
                        {/* <button className='p-2 w-full bg-slate-700 justify-center flex rounded-xl'><ArrowUturnRightIcon className='w-6 stroke-[2.5] h-6 text-white'/></button> */}
                    </div> 
                    <button className='flex w-full items-center space-x-2 font-semibold text-slate-400 p-3 py-1 rounded-full     bg-slate-700' >

                        <BoltIcon className='w-4 h-4 stroke-[3]' />
                        <span>using depth 14</span>
                    </button>

                   {bMove && <div className='bg-violet-400 rounded-full justify-center flex text-violet-700 p-1 font-semibold'>
                        {bMove}
                    </div>}

                    {evalMoves?.length == 0 && <div className='flex space-x-3 items-center font-semibold text-slate-400 justify-center w-full'>
                        <div className='loader w-6 h-6'>

                        </div>
                        <p>calculating...</p>
                    </div>}
                   
                    {(evalMoves
  ?.sort((a: any, b: any) => b.cpData - a.cpData)
  ?.filter(
    (move: any, index: any, self: any) =>
      index === self.findIndex((m: any) => m.moves === move.moves)
  ))?.map(({ moves, cpData }: any) => (
                        <div key={moves} onClick={() => {
                            let toGoto = moves.split(" ")[0];
                            let gameCopy = game?.main;
                            gameCopy.move(toGoto)
                            setGame({ main: gameCopy });
                            setEvalMoves([]);
                            setBMove("");

                            // console.log(positions)
                            lozza.postMessage("setoption name MultiPv value 3")
                            lozza.postMessage(`position fen ${game?.main?.fen()}`);
                            lozza.postMessage(`go depth 14`);
                        }} className='px-2 py-[2px] hover:bg-slate-400/10 trans cursor-pointer border-2 border-slate-600 w-full rounded-full font-semibold text-white space-x-2'>
                            <span>{cpData == Math.abs(cpData) ? `+${cpData}` : cpData}</span>
                            <span className='text-slate-400'>{moves.substring(0, 24)}..</span>
                        </div>
                    ))}
                         
                </div>
            </div>

        </div >
    );
}
