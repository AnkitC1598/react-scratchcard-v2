import React from 'react'
import ScratchCard, { CUSTOM_BRUSH_PRESET } from 'react-scratchcard-v2'

import * as IMG from './img.jpg'

const App = () => {
  return (
    <div>
      <ScratchCard
        width={320}
        height={226}
        image={IMG}
        finishPercent={80}
        onComplete={() => console.log('complete')}
        brushSize={40}
        customBrush={CUSTOM_BRUSH_PRESET}
      >
        <div style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        >
          <h1>Scratch card</h1>
        </div>
      </ScratchCard>
    </div>
  )
}

export default App
