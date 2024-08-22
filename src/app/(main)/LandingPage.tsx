import React from 'react'
import TypingAnimation from '~/components/magicui/typing-animation'
import { AniList } from '../_components/AniList'
import { TextReveal } from '../_components/TextReveal'


function LandingPage() {
  return (
    <div className='grid grid-cols-12 items-center '>
      


          <div className='sm:col-span-8 col-span-12'>
             <TextReveal />
         </div>
     
     
      <div className='sm:col-span-4 col-span-12'>
        <AniList />
         </div>
      
      
      </div>
  )
}

export default LandingPage