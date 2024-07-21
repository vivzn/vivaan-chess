//add a sessionID in the text to ignore the sender who sent

import { pusherServer } from "@/pusherConfig"

export async function POST(req: Request) {
  const { text, roomId, channel } = await req.json()


  //ADD AWAIT HER
  await pusherServer.trigger(roomId, channel, text)

  return new Response(JSON.stringify({ success: true }))
}