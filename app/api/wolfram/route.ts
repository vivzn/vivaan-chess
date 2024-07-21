import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const response = await axios.get(`http://api.wolframalpha.com/v2/query`, {
        params: {
            appid: 'PUGW8X-7JKK54YT77',
            input: "population of france",
        },
    }).catch((err) => err);
    return NextResponse.json(response);
}