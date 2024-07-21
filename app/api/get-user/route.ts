//add a sessionID in the text to ignore the sender who sent
import connectDB from "@/lib/connectDB"
import { pusherServer } from "@/pusherConfig"
import user from "@/models/User"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();
    const data_: any = await req.json() as any;
    let data;
    if(data_?.id) {
        data = await user.findById(data_?.id as string).exec();
    } else {
         data = await user.findOne(data_).exec();
    }
    

    return NextResponse.json(data);
}