//add a sessionID in the text to ignore the sender who sent
import connectDB from "@/lib/connectDB"
import { pusherServer } from "@/pusherConfig"
import { NextResponse } from "next/server";
import game from "@/models/Game"

export async function POST(req: Request) {
    await connectDB();
    const data = await req.json()

    const s = await game.create(data)

    return NextResponse.json(s);
}