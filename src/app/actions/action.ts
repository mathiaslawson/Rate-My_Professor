"use server";

import { tool } from "ai";
import { z } from "zod";
import { createResource } from "~/lib/actions/resources";


const tools = {
  addResource: tool({
    description: `Add a resource to your knowledge base. If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
    parameters: z.object({
      content: z
        .string()
        .describe("The content or resource to add to the knowledge base"),
    }),
    execute: async ({ content }) => createResource({ content }),
  }),
};


export const klasuAction = async (question: string) => {
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful assistant that answers questions about the Headstarter Summer Fellow program.\nYou are only qualified to answer questions related to this program, and for other topics, you should reply that you are only qualified to answer questions about the Headstarter Summer Fellow program.\n\nHere's some information about the program:\n\n**Track A Goal:**\nFinal project to get 1000 people on waitlist, 1000 accounts created, or $1000 in revenue.\n\n**Track B Goal:**\nFinal project that takes a startup’s current backlog and builds it meeting business requirements.\n\n**Track C Goal:**\nFinal project with an accepted PR from an open-source community.\n\n**First Principles:**\n- More and more companies seek senior level skills in entry-level roles.\n- Learning is commoditized. Coveted is community and real-human feedback.\n- Job security is like running a business. One needs sales, engineering, and marketing roles.\n\n**Motivation:**\nMany are passionate about software engineering because of the ability to build and innovate, solving problems and creating communities globally. The space is also in high demand and offers strong career prospects and financial opportunities. As such, we’ve developed our fellowship, allowing college students passionate about the space to refine their skills, build connections, and get practical experience coding, building, and generating revenue.\n\n**Requirements:**\nApplicants are required to be proficient in at least one programming language and able to allocate 20 hours a week to the fellowship. We anticipate high demand for the limited seats available and want to ensure selected fellows are fully present and maximize the benefits of the program.\n\n**What:**\nHeadstarter Summer Fellow. This is a 7-week software engineering fellowship. The program will consist of building 5 AI projects, 5 weekend hackathons, 1 final project with 1000+ users, interview prep, resume reviews and feedback from real software engineers.\n\n**Who:**\nWe prioritize passion and interest in the space. The program is open to candidates ranging from freshman year of high school to a graduate student who needs more experience and technical skills on their resume. We are targeting anyone who has been discouraged by the opaque application process for a summer internship and feels the lack of experience will inhibit their ability to be competitive for a full-time job. We designed this program to level the playing field and help train the next generation of engineers.\n\n**Why:**\nEducation is just one line on your resume. This fellowship is designed to help land most interviews. It will boost every area of your resume: experience, skills, projects, and activities. Since you are building hands-on projects, you will have good points to talk about in interviews, the skills gap from school to real-world will be smaller and the feedback and ideas you get from real software engineers will fast-track your career.\n\n**Rules:**\n- All projects and modules will be accessible via the Headstarter platform through a unique link.\n- Each week a new set of projects will be sent out with coding demos, resources, and where to submit.\n- The first task each week is an AI coaching call where you'll be asked your 5-year vision, how you prioritize the week, along with feedback on your resume and networking.\n- Without completing the coaching call, there will be no access to projects.\n- Other types of activities will appear like a mock interview, meetups, etc.\n- Projects are due Friday and will have to be uploaded on Reddit for peer feedback.\n- Those who submit projects will have access to the hackathon.\n- Teammates will be made from Week 3 and each week there will be a teammate evaluation.\n- Every other weekend will be a virtual hackathon and the other weekends will be an IRL meetup.\n\n**Last 2 Weeks:**\n- Based on your track, you will determine the scope of your final project.\n- In the last 4 days of the fellowship (September 5th to September 9th), you will get to demo to software engineers.\n- The AI evaluation, the team evaluation, and your growth as a Software Engineer will be shared with companies to reach out if they want to hire you.\n\nBecome a 1% software engineer. Build 5 AI projects in 5 weeks, ship to 1000 users last 2 weeks, hackathons, IRL meetups starting July 22. For Free.\n\nDeadline has passed, but we're taking final apps below ;)\n\n---\n\nQuestion: ${question}\nAnswer: `,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 200,
          stopSequences: [],
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    },
  );

  const data = (await response.json()) as {
    candidates: { content: { parts: { text: string }[] } }[];
  };

  // Extract the response text
  const answer =
    data.candidates[0]?.content.parts[0]?.text ?? "No answer available";

 
    await tools.addResource.execute({
      content: answer
    });
  

  return answer;
};
