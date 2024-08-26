'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

export default function ProfessorBot() {

  interface Card {
    name: string;
    course: string;
    school: string;
    description: string; 
    rating: number;
  }

  interface Professors {
    professors?: Card[];
  }

  const [professors, setProfessors] = useState<Card[]>([]);

 const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
   maxToolRoundtrips: 2,
   api: '/api/professors', 
   onResponse: async (response) => {

     if (response.ok) {
        try {
          const data: unknown = await response.json(); 
          setProfessors(data as Card[]);
          console.log('Received data:', data);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      } else {
        console.error('Error with response:', response.statusText);
      }
    
    }
 });
  
  
  console.log(messages);
  
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
          placeholder="Enter URL ....."
          onChange={handleInputChange}
        />
      </form>

     
    </div>
  );
}