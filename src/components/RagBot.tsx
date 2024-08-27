'use client';

import { useChat } from 'ai/react';
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

export default function Chat() {
 const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
   maxToolRoundtrips: 2,
   onResponse: async (response) => { 
     console.log(response);
   }
 });
  
  
  console.log(messages);
  
  return (
    
    <div className='flex justify-between'>
        <div className="">


    <ScrollArea className="h-[220px] w-full px-3 py-1 sm:h-[350px]">
        
         <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap  bg-neutral-200 border border-neutral-300 shadow-sm text-black p-1 px-5 rounded-3xl w-max">
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

        <div>
          {  isLoading && (<> <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-500 border-solid"></div></>)}
</div>

     <form onSubmit={handleSubmit}>
        <input
          className="relative sm:w-[200rem] w-[50rem] max-w-lg p-3 mb-8 border border-gray-300 rounded-xl shadow-xl mt-6 text-white bg-black "
          value={input}
          placeholder="Enter URL ..... Or Paste the professors data ....."
          onChange={handleInputChange}
        />
      </form>

     
      </div>
      
    
  </div>
  );
}