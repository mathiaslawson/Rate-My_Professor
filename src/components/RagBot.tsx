'use client';

import { useChat } from 'ai/react';
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

export default function Chat() {
 const { messages, input, handleInputChange, handleSubmit } = useChat({
  maxToolRoundtrips: 2,
 });
  
  return (
    
    <div className="">

    <ScrollArea className="h-[220px] w-full px-3 py-1 sm:h-[350px]">
        
         <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap w-[300px] bg-neutral-200 border border-neutral-300 shadow-sm text-black p-1 px-5 rounded-3xl ">
            <div>
              <div className="font-bold">{m.role}</div>
              <p>
                {m.content.length > 0 ? (
                  m.content
                ) : (
                  <span className="italic font-light">
                    {'storing knowledge base: ' + (m?.toolInvocations?.[0]?.toolName ?? '')} 
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

     
        </ScrollArea>



 <form onSubmit={handleSubmit}>
        <input
          className="relative sm:w-[200rem] w-[50rem] max-w-lg p-3 mb-8 border border-gray-300 rounded-xl shadow-xl mt-6 "
          value={input}
          placeholder="Ask anything ... Then teach everything ....."
          onChange={handleInputChange}
        />
      </form>

     
    </div>
  );
}