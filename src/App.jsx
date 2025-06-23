import { useState } from 'react'
import './App.css'
import Mainpage from './mainpage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Mainpage />
    </>
  )
}

export default App
