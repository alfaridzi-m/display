import './index.css'
import Display from './testpage'
import './App.css'
import DisplayMain from './mainpage'
import DisplayOther from './otherpage'
import NotAvaiable from './na'

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ='/size' element={<NotAvaiable />} />
        <Route path="/" element={<DisplayMain />} />
        <Route path="/tespage" element={<Display />} />
        <Route path="/otherpage" element={<DisplayOther />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
