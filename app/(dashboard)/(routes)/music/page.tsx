"use client";

import * as z from "zod";
import axios from "axios";
import { Heading } from "@/components/heading";
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { useProModel } from "@/hooks/use-pro-model";
import toast from "react-hot-toast";

const MusicPage = () => {
    const proModel = useProModel();
    const router = useRouter();
    const [music, setMusic] = useState<string>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setMusic(undefined); // Clear previous music first
    
            const response = await axios.post("/api/music", values);
            console.log("Received music URL:", response);

            if (response.data) {
                setMusic(response.data);
            } else {
                console.error('No audio URL in response:', response.data);
            }

            form.reset();
        } catch (error: any) 
        {
            if(error?.response?.status === 403) {
                proModel.onOpen();
            }
            else {
                toast.error("Something went wrong")
            }
            // console.log(error)
            // console.error("Error submitting form:", error);
        } finally {
            router.refresh();
        }
    };

    return(
        <div>
            <Heading 
                title="Music Generation"
                description="No practice, no skill: no problem"
                icon={Music}
                iconColor="text-emerald-500"
                bgColor="text-emerald-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="
                                rounded-lg
                                border
                                w-full
                                p-4
                                px-3
                                md:px-6
                                focus-within:shadow-sm
                                grid
                                grid-cols-12
                                gap-2
                            "
                        >
                            <FormField 
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input 
                                                className="
                                                    border-0 
                                                    outline-none
                                                    focus-visible:ring-0
                                                    focus-visible-ring-transparent                                                    
                                                    "
                                                disabled={isLoading}
                                                placeholder="A guitar solo like that in November Rain"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>

                            <p className="col-span-12 text-center text-sm text-gray-600">
                                Note: Processing may take around 1 minute.
                            </p>

                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}

                    {!music && !isLoading && (
                        <Empty label="No music prompt given :(" />
                    )}

                    {music && (
                        <audio controls autoPlay className="w-full mt-8">
                            <source src={music} type="audio/mp3" />
                            Your browser does not support the audio element.
                        </audio>
                    )}

                </div>
            </div>
        </div>
    );
}

export default MusicPage;