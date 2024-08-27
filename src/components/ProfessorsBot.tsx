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
    
    <div className='flex justify-between gap-20 flex-wrap'>
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
          placeholder="Search For Professors ....."
          onChange={handleInputChange}
        />
      </form>

     
      </div>
      
      <div></div>
    
      {
        isLoading ? (<> <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-500 border-solid"></div></>)
          : 
          professors && professors.length > 0 ? (<>
           <div className='sm:absolute sm:right-20'>
        <h3 className='text-white text-center mt-10 mb-5'>Search Results</h3>
        
              <ScrollArea className="h-[220px] w-full px-3 py-1 sm:h-[500px] gap-3">
              
                {
                  professors.map((professor, index) => (
                    <div key={index} className='bg-neutral-300 sm:w-[600px] py-4 px-4 rounded-xl bg-opacity-10 shadow-transparent border border-neutral-500 text-white frosted h-max mx-2'>
                      <h2 className='text-3xl font-bolder'>{professor.name}</h2>
                      <p className='text-xl'>{professor.course}</p>
                      <p>{professor.description}</p>
                      <div className='flex justify-between mt-10'>
                        <div className='p-2 bg-neutral-700 rounded-xl frosted bg-opacity-15'>Professor Ranking : {professor.rating}</div>
                        {/* <div className='p-2 bg-neutral-700 rounded-xl frosted bg-opacity-15'>Search Accuracy (out of 1) : 0.9</div> */}
                      </div>
                    </div>
                  ))
          }
         </ScrollArea>
            </div></>) : (<>
               <div className='sm:absolute sm:right-20'>
        <h3 className='text-white text-center mt-10 mb-5'> Results</h3>
        
        <div className='grid gap-4'>
             <div className='bg-neutral-300 sm:w-[600px] py-4 px-4 rounded-xl bg-opacity-10 shadow-transparent border border-neutral-500 text-white frosted h-max mx-2'>
          <p className='text-xl text-center'>You have not searched for any professors yet</p>
         
        
            </div>
         </div>
              </div>
            </>)
      }
     
  </div>
  );
}