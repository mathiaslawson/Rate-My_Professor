
import Link from "next/link";
import Klaus from "~/components/klaus";
import Chat from "~/components/RagBot";
import LandingPage from "./(main)/LandingPage";
import { auth, currentUser } from "@clerk/nextjs/server";
import { FloatDock } from "./_components/FloatDock";
import ProfessorBot from "~/components/ProfessorsBot";


export default async function Home() {

  const { userId } = auth();

  if (userId) {
   console.log("userId", userId);
  }

  


  return (
    <>
      {userId ?
      (
          <main className="flex min-h-screen flex-col items-center justify-center  text-black">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
              {/* <h5>URL BOT AND MASS DATA BOT</h5>
              <Chat />  */}

              
              <h5>Professor Bot</h5>
               <ProfessorBot /> 
              
              <div className="absolute bottom-10">
                 <FloatDock />
             </div>
        </div>
       </main>
      )
        
        : (
            <main className="flex items-center justify-center min-h-screen">
            <div className="px-4 max-w-screen-4xl">
              
      <LandingPage />
      </div>
    </main>
        )}
      
     
    </>
  );
}
