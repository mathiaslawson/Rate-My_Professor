import React from 'react'
import Chat from '~/components/RagBot'
import { FloatDock } from '../_components/FloatDock'

function ChatPage() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <Chat />

      {/* <div>
        <FloatDock />
      </div> */}
   </div>
  )
}

export default ChatPage