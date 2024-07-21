//add a sessionID in the text to ignore the sender who sent
import connectDB from "@/lib/connectDB"
import { pusherServer } from "@/pusherConfig"
import user from "@/models/User"
import { NextResponse } from "next/server";
import { TURBO_TRACE_DEFAULT_MEMORY_LIMIT } from "next/dist/shared/lib/constants";
const { v4: uuidv4 } = require("uuid");

export async function POST(req: Request) {
    await connectDB();
    const { name, elo, email, photoURL } = await req.json()

    let toRes;

    const data = await user.findOne({ email });

    if (data) {
        //user exists, just sign in

        toRes = {data}



    } else {
        //make new user


        const person = new user({
            name,
            elo,
            email,
            photoURL,

            joined: new Date(),
            playedGames: [],
        })

        await person.save()

        toRes = {data:person};
    }



    return NextResponse.json({ toRes });
}