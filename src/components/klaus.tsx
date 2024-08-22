"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { Send, User } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { generateRandomId } from "~/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { klasuAction } from "~/app/actions/action";


const questionSchema = z.object({
  question: z.string().min(2, {
    message: "question must be at least 2 characters.",
  }),
});


type Message = {
  id: number;
  role: "user" | "assistant";
  content: string | undefined;
};

const Klaus = () => {

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: generateRandomId(),
      role: "assistant",
      content: "Hi, I'm Klaus",
    },
  ]);
  const [loading, setLoading] = React.useState(false);

const bottomRef = React.useRef<HTMLDivElement | null>(null);
 
 const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
    },
  })

 

  async function onSubmit(values: z.infer<typeof questionSchema>) {
    const { question } = values;

    console.log(typeof question, 'this is question')

    const userMessage: Message = {
      id: generateRandomId(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMessage]);
    form.setValue("question", "");
    setLoading(true);

    try {
      console.log(question, 'this is question')

      const answer = await klasuAction(question).then((res) => {
        const id = generateRandomId();
      const newMessage: Message = { id, role: "assistant", content: res };
      setMessages((prev) => [...prev, newMessage]);
      setLoading(false);
      })

    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong. Please try again later.");
    }
  }

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex w-[min(95%,650px)] flex-col gap-2">
      {messages.length > 0 && (
        <ScrollArea className="h-[220px] w-full px-3 py-1 sm:h-[350px]">
          {messages.map((message) => (
            <div key={message.id} className="mb-2 flex w-fit flex-col gap-1">
              {message.role === "user" ? (
                <div className="flex select-none items-center gap-1 text-sm text-muted-foreground">
                  <User strokeWidth="1.5" className="aspect-square w-5" />
                  <span>You</span>
                </div>
              ) : (
                <div className="flex select-none items-center gap-1 text-sm ">
                 
                  <span>Klaus</span>
                </div>
              )}
              <ScrollArea
                className={cn(
                  "ml-6 flex max-h-32 flex-col gap-1 rounded-lg rounded-tl-[3px] border",
                  message.role === "user"
                    ? "bg-secondary/60"
                    : "border-primary/30 bg-primary/20",
                )}
              >
                <p className="rounded-none px-4 py-1.5 text-xs md:text-sm">
                  {message.content}
                </p>
              </ScrollArea>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-1 pb-4 text-sm">
              
              <span className="animate-pulse text-xs text-muted-foreground">
                generating...
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </ScrollArea>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="relative flex w-full items-center">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Ask anything about the Headstarter Fellow Program"
                      {...field}
                      disabled={loading}
                      className="w-full text-xs md:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild className="absolute right-2 top-0.5">
                  <Button
                    className=
                      "h-9 w-9 rounded-lg bg-transparent p-0 text-muted-foreground hover:bg-secondary"
                    type="submit"
                    disabled={loading}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send question</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="rounded-sm text-xs">
                  Send question
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default Klaus;
