import { Button } from "~/components/ui/button";
import BoxReveal from "~/components/magicui/box-reveal";
import { StarButton } from "./StarButton";
import Link from "next/link";

export async function TextReveal() {
  return (
    <div className="h-full w-full max-w-[32rem] items-center justify-center overflow-hidden pt-8">
      <BoxReveal boxColor={"#cbcbcb"} duration={0.5}>
        <p className="text-[3.5rem] font-semibold">
          ProfessorRatings<span className="text-[#1b1a1e]"></span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#cbcbcb"} duration={0.5}>
        <h2 className="mt-[.5rem] text-[1rem]">
          ProfessorRatings is a RAG chatbot that is able to provide info{" "}
          <span className="text-[#5046e6]">Based on infered knowledge base on professors around the world</span>
        </h2>
      </BoxReveal>

       <BoxReveal boxColor={"#cbcbcb"} duration={0.5}>
        <h2 className="mt-[.5rem] text-[1rem]">
        Two ways of adding professor ratings to this bot is by either entering a url link were the information to that link is scrapped and used, or you just drop in the professors data{" "}
          <span className="text-[#5046e6]">or you just drop in the professors data</span>
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#cbcbcb"} duration={0.5}>
        <div className="mt-[1.5rem]">
          <p>
            -&gt; In this case it is able to learn what ever you give to it and also provide information based on that
            <span className="font-semibold text-[#5046e6]"> knowledge base.</span>
           
           
            <br />
            <br />
            -&gt; 100% open-source, and customizable. <br />

            <br />
          
           

          </p>
        </div>
        
      </BoxReveal>

      <BoxReveal boxColor={"#cbcbcb"} duration={0.5}>
        <div>
          <StarButton />
        </div>
      </BoxReveal>

      <BoxReveal boxColor={"#cbcbcb"} duration={0.5}>
        <Link href="/sign-in">
          <Button className="mt-[1.6rem] bg-[#1f1d39]">Explore </Button>
        </Link>
      </BoxReveal>
    </div>
  );
}
