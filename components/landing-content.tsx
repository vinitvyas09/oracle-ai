"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
    {
        name: "L. da Vinci",
        avatar: "L",
        title: "Polymath",
        description: "With this tool, I sketched designs for a new machine—only using words! It’s almost like having an apprentice who reads my mind. A true renaissance on the web."
    },
    {
        name: "Marco P.",
        avatar: "M",
        title: "Explorer",
        description: "$20 a month for limitless creations? That's cheaper than feeding my camels. Absolutely worth it!"
    },
    {
        name: "Vincent van G.",
        avatar: "V",
        title: "Painter",
        description: "If only I had this site back then, I could have painted 'Starry Night' during the day"
    },
    {
        name: "J. Austen",
        avatar: "J",
        title: "Novelist",
        description: "Creating music that sounds like it leapt right out of a ballroom scene in one of my novels? Absolutely delightful."
    },
    {
        name: "C.",
        avatar: "C",
        title: "Queen of Egypt",
        description: "Creating videos about my reign with just a description makes this the eighth wonder of the world"
    },
    {
        name: "Marie C.",
        avatar: "M",
        title: "Physicist",
        description: "Discovering radium was costly, but $20 a month for unlimited AI discoveries is a scientific breakthrough in budgeting."
    },
]
export const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {testimonials.map((item) => (
                    <Card key={item.description} className="bg-[#192339] border-none text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <div>
                                    <p className="text-lg">{item.name}</p>
                                    <p className="text-zinc-400 text-sm">{item.title}</p>
                                </div>
                            </CardTitle>
                            <CardContent className="pt-4 px-0">
                                {item.description}
                            </CardContent>
                        </CardHeader>
                    </Card>

                ))}
            </div>
        </div>
    )
}