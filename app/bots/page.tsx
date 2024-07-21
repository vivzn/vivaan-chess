"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import Avatar from 'boring-avatars';
import Image from "next/image";
import { BoltIcon, PlayIcon } from "@heroicons/react/24/solid";
import { Chess } from "chess.js";
import { toast } from "react-hot-toast";
import { CpuChipIcon } from "@heroicons/react/24/outline";

function Page() {
    const lozza: any = useMemo(() => typeof window !== "undefined" && new Worker("/stockfish.js"), []);
    useEffect(() => {
        lozza.postMessage("uci"); // lozza uses the uci communication protocol
        lozza.postMessage("ucinewgame"); // reset tt
        lozza.postMessage(`isready`);
        lozza.postMessage(`position startpos`);

        lozza.onmessage = function (e: any) {
            if (e?.data?.includes("bestmove")) {
                console.log(e?.data);
                const bestMove = e?.data?.split("bestmove ")[1];

                const source = bestMove[0] + bestMove[1];
                const target = bestMove[2] + bestMove[3] + (bestMove[4] || "");

                setMove_({ from: source, to: target });
            } else {
                console.log(e?.data);
            }
            //parse messages from here as required
        };
    }, []);

    const [move_, setMove_] = useState<any>(null);
    useEffect(() => {
        if (move_ == null) return;

        let gameCopy = game;

        const isPromotion = move_?.to[4]
            ? move_?.to[4] == "b" ||
                move_?.to[4] == "r" ||
                move_?.to[4] == "q" ||
                move_?.to[4] == "n"
                ? move_?.to[4]
                : null
            : undefined;

        let moveE = game.move({
            from: move_?.from,
            to: move_?.to[0] + move_?.to[1],
            promotion: isPromotion,
        });

        if (moveE) {
            // setHistory((old: any) => [
            //   ...old,
            //   {
            //     from: move_?.from,
            //     to: move_?.to,
            //   },
            // ]);

            let oldHistory = history;

            oldHistory.push({
                from: move_?.from,
                to: move_?.to,
                promotion: isPromotion || undefined,
            });

            setGame(new Chess(gameCopy.fen()));
        }
    }, [move_]);

    const [chessH, setChessH] = useState<number>(400);


    const [game, setGame] = useState(new Chess());

    useEffect(() => {
        if (game.isStalemate()) {
            toast.custom(<div className="p-4 rounded-full flex bg-white text-black px-4 justify-center text-xl">
                <h1>You have drawed by <span className="font-bold">Stalemate</span></h1>
            </div>);
        } else if (game.isInsufficientMaterial()) {
            toast.custom(<div className="p-4 rounded-full flex bg-white text-black px-4 justify-center text-xl">
                <h1>You have drawed by <span className="font-bold">Insufficient Material</span></h1>
            </div>);
        } else if (game.isThreefoldRepetition()) {
            toast.custom(<div className="p-4 rounded-full flex bg-white text-black px-4 justify-center text-xl">
                <h1>You have drawed by <span className="font-bold">Three move repeats</span></h1>
            </div>);
        } else if (game.isCheckmate()) {
            toast.custom(<div className="p-4 rounded-full flex bg-white text-black px-4 justify-center text-xl">
                <h1>You have {game.turn() == selectedPlay ? "lost" : "won"} by <span className="font-bold">Checkmate</span></h1>
            </div>);
        }

    }, [game.fen()]);

    const [history, setHistory] = useState<any>([]);

    const onDrop = (sourceSquare: any, targetSquare: any, piece: any) => {
        // console.log(selectedPlay, piece[0], game.turn())

        // let str_ = "";
        // const list = history.forEach((b: any) => {
        //   str_ += " " + String(b?.from + b?.to);
        // });

        // // lozza.postMessage(`setoption name MultiPV value 6`);
        // lozza.postMessage(`position startpos moves${str_}`);
        // lozza.postMessage(`go depth ${selected?.depth}`);
        // lozza.postMessage(`setoption name MultiPV value 0`);

        if (piece[0] === game.turn() && game.turn() === selectedPlay) {
            let gameCopy = game;
            const promotions = game
                .moves({ verbose: true })
                .filter((m) => m.promotion);
            let promotionTo: any = undefined;
            if (
                promotions.some(
                    (p) => `${p.from}:${p.to}` == `${sourceSquare}:${targetSquare}`
                )
            ) {
                if (typeof window == "undefined") return;
                promotionTo = window.prompt(
                    "Promote your pawn to: r (rook), b (bishop), q (queen), or n (knight)."
                );
                if (
                    !(
                        promotionTo == "r" ||
                        promotionTo == "b" ||
                        promotionTo == "q" ||
                        promotionTo == "n"
                    )
                ) {
                    // alert(
                    //   "You did not enter a valid promotion to, your pawn will automatically be promoted to a queen."
                    // );
                    alert("You did not enter a valid promotion to, your pawn will automatically be promoted to a queen.");
                    promotionTo = "q";
                }
            }
            if (gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: promotionTo || undefined })) {
                setHistory((old: any) => [
                    ...old,
                    {
                        from: sourceSquare,
                        to: targetSquare,
                        promotion: promotionTo || undefined
                    },
                ]);
                // console.log(`position rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2`)
                setGame(new Chess(gameCopy.fen()));

                let oldHistory = history;

                oldHistory.push({
                    from: sourceSquare,
                    to: targetSquare,
                    promotion: promotionTo || undefined
                });

                let str = "";
                const list = oldHistory.forEach((b: any) => {
                    str += " " + String(b?.from + b?.to + (b?.promotion || ""));
                });

                console.log(str);

                // return;

                lozza.postMessage(
                    `setoption name Skill Level value ${selected?.skill}`
                );
                lozza.postMessage(`position startpos moves${str}`);
                lozza.postMessage(
                    `go depth ${selected?.depth} movetime ${selected?.time}`
                );
                // lozza.postMessage(``);

                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

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


    const [selectedPlay, setSelectedPlay] = useState<any>("w");

    const [started, setStarted] = useState<boolean>(false);

    const bots = [
        {
            name: "Matt",
            elo: "450",
            desc: "Matt is a begginer but is trying to improve",
            depth: 1,
            skill: 0,
            time: 6,
            photoURL: "/james.png",
        },
        {
            name: "Sam",
            elo: "850",
            desc: "Sam just started playing Chess and isn't too bad.",
            depth: 1,
            skill: 0,
            time: 60,
            photoURL: "/sam.png",
        },
        {
            name: "Will",
            elo: "950",
            desc: "Typical Gymbro; plays chess sometimes.",
            depth: 1,
            skill: 0,
            time: 200,
            photoURL: "/atharva.png",
        },
        {
            name: "Emma",
            elo: "1050",
            desc: "Steam works at a clock factory.",
            depth: 2,
            skill: 1,
            time: 400,
            photoURL: "/steam.png",
        },

        {
            name: "Quinn",
            elo: "1250",
            desc: "Quinn often plays in her school chess tournaments.",
            depth: 3,
            skill: 3,
            time: 400,
            photoURL: "/quinn.png",
        },
        {
            name: "Mia",
            elo: "1700",
            desc: "The Devil...",
            depth: 5,
            skill: 4,
            time: 500,
            photoURL: "/Satan.png",
        },
        {
            name: "Doug",
            elo: "1900",
            desc: "Gifted student at Harvard.",
            depth: 6,
            skill: 6,
            time: 500,
            photoURL: "/doug.png",
        },
        {
            name: "Oliver",
            elo: "1900",
            desc: "61 year old man who has a passion for chess.",
            depth: 7,
            skill: 6,
            time: 500,
            photoURL: "/kumar.png",
        },
        {
            name: "Harp",
            elo: "2000",
            desc: "Young professor at UCLA, and has won her national chess open.",
            depth: 13,
            skill: 8,
            time: 500,
            photoURL: "/scarlett.png",
        },
        {
            name: "Beth",
            elo: "2050",
            desc: "O' chapo, the grandest chess player in his time.",
            depth: 20,
            skill: 15,
            time: 1000,
            photoURL: "/chap.png",
            red: true,
        },
        {
            name: "Victor",
            elo: "2500",
            desc: "Eccentric bogeyman of chess; nobody knows where he came from.",
            depth: 22,
            skill: 20,
            time: 1000,
            photoURL: "/cucuy.png",
            red: true,
        },
    ];

    const [selected, setSelected] = useState<any>(bots[0]);

    useEffect(() => { }, []);

    useEffect(() => {
        if (started == false) return;
        if (selectedPlay == "w") return;
        lozza.postMessage(
            `setoption name Skill Level value ${selected?.skill}`
        );
        lozza.postMessage(`position startpos`);
        lozza.postMessage(
            `go depth ${selected?.depth} movetime ${selected?.time}`
        );
    }, [started]);

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
        <div className="w-full h-full flex justify-center items-center space-x-4">
            {started ? (
                <>
                    {selected && (
                        <div className="flex flex-col space-y-4 items-center">
                            <div className="h-fit flex items-center rounded-xl bg-slate-800">
                                <div
                                    className={`cursor-pointer h-full rounded-full p-2 flex flex-col items-center justify-center px-8 space-y-2`}
                                >
                                    <Avatar
                                        size={40}
                                        name={selected?.name}
                                        variant="beam"
                                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                    />
                                    <div className="flex flex-col items-center">
                                        <h1 className="font-semibold text-white-500 text-[18px]">
                                            <span className="text-white">
                                                {selected?.name}
                                            </span>
                                        </h1>
                                        <p
                                            className={`text-white/50 font-semibold text-[14px]`}
                                        >
                                            {selected?.elo} elo
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => {
                                const agree = confirm("Are you sure you will quit, your game will be cleared.")
                                if (!agree) return;
                                setStarted(false);
                                setGame(new Chess());
                                setHistory([]);
                                setMove_(null)
                            }} className="bg-violet-400 cursor-pointer rounded-full text-white font-semibold p-2 px-4">go back</button>
                        </div>
                    )}
                    <div className="flex space-x-4 items-center">
                        <Chessboard
                            id={"game"}
                            customDropSquareStyle={{
                                boxShadow: "inset 0 0 0px 6px rgba(255,255,255,1)",
                            }}
                            animationDuration={200}
                            //  arePremovesAllowed
                            customPieces={pieceComponents} customBoardStyle={{ borderRadius: '2px', boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }} customLightSquareStyle={{ backgroundColor: "#f3f4f6" }} customDarkSquareStyle={{ backgroundColor: "#60a5fa" }} customNotationStyle={{ fontWeight: '800', fontFamily: "satoshi" }}
                            showBoardNotation={true}
                            boardOrientation={selectedPlay == "w" ? "white" : "black"}
                            customArrowColor="rgba(100, 200, 100, 0.9)"
                            // customLightSquareStyle={{ backgroundColor: "#a5c296" }}
                            // customDarkSquareStyle={{ backgroundColor: "#588f68" }}
                            position={game.fen()}
                            // customBoardStyle={{ borderRadius: "2px" }}
                            onPieceDrop={onDrop as any}
                            boardWidth={chessH}

                            snapToCursor
                        />
                    </div>
                </>
            ) : (
                <div className="flex flex-col space-y-4">

                    <div className="p-4 h-fit flex flex-col w-[600px] space-y-4 items-center rounded-xl bg-slate-800">
                        <div className="flex space-x-4 items-center w-full justify-between">

                            <div className="flex space-x-4 items-center">
                                
                                <div
                                    onClick={() => setSelectedPlay("w")}
                                    className={`p-2 cursor-pointer transition duration-200 ease-in-out bg-white rounded-full w-11 h-11 flex justify-center items-center ${selectedPlay == "w"
                                        ? "ring-blue-500 ring-4"
                                        : "ring-gray-400 ring-4"
                                        }`}
                                >
                                    <BoltIcon className="w-5 h-5 text-black" />
                                </div>
                                <div
                                    onClick={() => setSelectedPlay("b")}
                                    className={`p-2 cursor-pointer transition duration-200 ease-in-out bg-black rounded-full w-11 h-11 flex justify-center items-center ${selectedPlay == "b"
                                        ? "ring-blue-500 ring-4"
                                        : "ring-gray-700 ring-4"
                                        }`}
                                >
                                    <BoltIcon className="w-5 h-5 text-white" />
                                </div>
                                {/* <span className="font-semibold text-white">play as</span> */}
                            </div>
                            <span className="font-semibold text-slate-500 flex items-center space-x-2">
                                <CpuChipIcon className="w-5 h-5"/>
                                <span>using stockfish.js</span>
                            </span>
                        </div>
                        <div className="w-full grid grid-cols-5 gap-3 h-[320px] overflow-y-scroll simpleScroll">
                            {bots.map((b: any) => (
                                <div
                                    key={b?.name}
                                    onClick={() => setSelected(b)}
                                    className={`cursor-pointer transition-all duration-200 ease-in-out hover:rounded-xl h-full rounded-xl bg-slate-700 p-2 flex flex-col items-center justify-center ${selected?.name == b?.name
                                        ? "bg-violet-400/40 "
                                        : ""
                                        } space-y-2`}
                                >


                                    <Avatar
                                        size={40}
                                        name={b?.name}
                                        variant="beam"
                                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                    />
                                    <div className="flex flex-col items-center">
                                        <h1 className="font-semibold text-white-500 text-[18px]">
                                            <span className="text-white">
                                                {b?.name}
                                            </span>
                                        </h1>
                                        <p
                                            className={`text-white/50 font-semibold text-[14px]`}
                                        >
                                            {b?.elo} elo
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => setStarted(true)}
                        className="bg-violet-400 justify-center transition duration-200 ease-in-out cursor-pointer hover:brightness-110 flex items-center space-x-2 font-semibold px-4 p-2 rounded-full text-white text-xl"
                    >
                        <PlayIcon className="w-6 h-6 text-white" />
                        <span>play</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Page;