"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  prompt: z
    .string()
    .min(7, { message: "Prompt must be be atleast 7 character long!" }),
});

export default function page() {
  const [outputImg, setOutputImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.status === 200) {
        setOutputImg(data.url);
      } else {
        console.log(data.error);
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full p-3 min-h-dvh h-full flex items-center justify-start pt-[72px] flex-col">
      <div className="w-full  p-3">
        <h1 className="text-center font-bold text-white text-4xl">Create</h1>
        <p className="text-white/60 text-center">
          Generate Stunning Images from Text for FREE
        </p>
      </div>
      <div className="flex  w-full gap-3 h-[calc(100dvh-200px)] md:flex-row flex-col ">
        <div className="__form h-full flex-[2] gap-2 flex justify-center items-start flex-col">
          <p className="text-center lg:text-left w-full text-sm text-white/80">
            Type your prompt below to create any image you can imagine
          </p>
          <div className="flex gap-2 w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex gap-2"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-full lg:max-w-[70%]">
                      <FormControl>
                        <Input
                          placeholder="a cat sitting over a sofa..."
                          className="w-full transition-all border-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button loading={loading} type="submit">
                  Generate
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="__output  min-h-[300px] lg:min-h-full lg:h-full flex-[1] bg-white/5 rounded-lg relative overflow-hidden">
          {outputImg ? (
            <Image
              alt="output"
              src={outputImg}
              height={300}
              width={300}
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <div className="w-full h-full items-center flex justify-center text-white/70 text-center p-3">
                Enter your prompt and hit generate!
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
