"use client";

import { cn } from "~/lib/utils";
import { AnimatedList } from "~/components/magicui/animated-list";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications = [
  {
    name: "Built by a team of 4",
    description: "",
    time: "",

    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQegfrfU-fTqsc-PnSLk5f5c9bioBe7cDY-Mg&s",
    color: "#00C9A7",
  },
  {
    name: "Vector Embeddings with Supabase",
    description: "Text Embeddings with Supabase",
    time: "",
    icon: "https://yt3.googleusercontent.com/NuBWxGpdF0YzNSr7x_Tc8EEFXbQoHc0Xf9rU_ehxFPRikw8YPN886HltWeMDihKU8v5SeKFI3B4=s900-c-k-c0x00ffffff-no-rj",
    color: "#FFB800",
  },
  {
    name: "Google Generative AI",
    description: "Google Generative AI",
    time: "",
    icon: "https://pbs.twimg.com/media/GDyl5j7aoAAMZ7X.jpg",
    color: "#FF3D71",
  },
  {
    name: "Vercel AI-SDK",
    description: "Supporting RAG and (Omni Channel) features",
    time: "",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkAuKrVgOa4BJxUnH4gdJ5TV0m2IFEMjLJ2g&s",
    color: "#1E86FF",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          // style={{
          //   backgroundColor: color,
          // }}
        >
          <span className="text-lg rounded-2xl"><img className="rounded-2xl" src={icon} height={40} width={40}></img></span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function AniList({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col p-6 overflow-hidden ",
        className,
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
