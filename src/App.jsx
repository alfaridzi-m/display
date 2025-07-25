import './index.css'
import Display from './testpage'
import './App.css'
import DisplayMain from './mainpage'

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DisplayMain />} />
        <Route path="/tespage" element={<Display />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
