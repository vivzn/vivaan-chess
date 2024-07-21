//add a sessionID in the text to ignore the sender who sent
import connectDB from "@/lib/connectDB"
import { pusherServer } from "@/pusherConfig"
import game from "@/models/Game"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();
    const { _id } = await req.json()
    const data = await game.findOne({ _id }).exec();

    return NextResponse.json(data);
}