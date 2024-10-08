"use client";

import * as z from "zod";
import axios from "axios";
import { Heading } from "@/components/heading";
import { VideoIcon } from "lucide-react";
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

const VideoPage = () => {
    const proModel = useProModel();
    const router = useRouter();
    const [video, setVideo] = useState<string>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setVideo(undefined); // Clear previous video first
    
            const response = await axios.post("/api/video", values);
            console.log("Received video URL:", response);

            if (response.data) {
                setVideo(response.data[0]);
            } else {
                console.error('No video URL in response:', response.data);
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
            // console.error("Error submitting form:", error);
        } finally {
            router.refresh();
        }
    };

    return(
        <div>
            <Heading 
                title="Video Generation"
                description="Imagination to video"
                icon={VideoIcon}
                iconColor="text-orange-700"
                bgColor="text-orange-700/10"
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
                                                placeholder="A thrilling skiing video"
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
                                Note: Backend zeroscope model has a bug and processing may take around 4 minutes.
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

                    {!video && !isLoading && (
                        <Empty label="No video prompt given :(" />
                    )}

                    {video && (
                        <video className="w-full aspect-vide mt-9 rounded-lg border bg-black" controls>
                            <source src={video} />
                        </video>
                    )}

                </div>
            </div>
        </div>
    );
}

export default VideoPage;