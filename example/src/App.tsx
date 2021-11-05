import React from 'react'

import ScratchCard from 'react-scratchcard-v2'

const App = () => {
  return (
    <div>
      <ScratchCard
        width={320}
        height={226}
        image={'https://images.app.goo.gl/jJJ6xpSoxFvQK8jH7'}
        finishPercent={80}
        onComplete={() => console.log("complete")}
      >
        <div style={{display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
         <h1>Scratch card</h1>
        </div>
      </ScratchCard>
    </div>
  )
}

export default App
