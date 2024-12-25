import { useState } from 'react'
import CardComponent from './DisplayCard'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <CardComponent />
    </>
  )
}

export default App
