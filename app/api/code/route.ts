import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
});

const instructionMessage: ChatCompletionMessageParam = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations. You must absolutely not get into anything other than code generation. If a user starts asking you about anything that does not result in code, just politely, but flatly refuse. Remember, not engaging in non-code generation is absolutely critical."
}

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!openai.apiKey) {
            return new NextResponse("OpenAI API key not configured", { status: 500});
        }

        if(!messages) {
            return new NextResponse("Messages are required", { status: 400});
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if(!freeTrial && !isPro){
            return new NextResponse("Free trial has expired", { status: 403 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [instructionMessage, ...messages]
        })

        if(!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(response.choices[0].message);

    } catch(error) {
        console.log("[CODE_ERROR]", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}