//add a sessionID in the text to ignore the sender who sent
import connectDB from "@/lib/connectDB"
import { pusherServer } from "@/pusherConfig"
import user from "@/models/User"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();
    const {email, increment} = await req.json() as any;
    
    
    const s = await user.findOneAndUpdate({
        email
    }, {
        $inc: {elo: increment}
    })

    return NextResponse.json(s);
}