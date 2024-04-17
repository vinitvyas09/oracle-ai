import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!
});

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!prompt) {
            return new NextResponse("Prompt is required", { status: 400});
        }

        const freeTrial = await checkApiLimit();

        if(!freeTrial){
            return new NextResponse("Free trial has expired", { status: 403 });
        }

        const input = {
            prompt: prompt,
            model_version: "stereo-large",
            output_format: "mp3",
            normalization_strategy: "peak"
        };
        
        const response = await replicate.run("meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb", { input });
        console.log("HEREE response", response)

        await increaseApiLimit();

        return NextResponse.json(response);

    } catch(error) {
        console.log("[MUSIC_ERROR]", error)
        // console.error(error.response.data)
        return new NextResponse("Internal Error", { status: 500 });
    }
}