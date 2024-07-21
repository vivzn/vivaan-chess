//add a sessionID in the text to ignore the sender who sent
import connectDB from "@/lib/connectDB"
import { pusherServer } from "@/pusherConfig"
import user from "@/models/User"
import { NextResponse } from "next/server";
import Game from "@/models/Game";

export async function POST(req: Request) {
    const { email }: any = await req.json() as any;
    
    
    
    
  try {
    await connectDB();
    console.log("CONNECTED TO MONGO");

    const dat = await Game.find({
      "members.user": email,
      
    });

    return NextResponse.json(dat);
  } catch (error) {
    console.log(error);
    return NextResponse.json({error});
  }


}