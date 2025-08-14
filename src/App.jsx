import './index.css'
import Display from './testpage'
import './App.css'
import DisplayMain from './mainpage'
import DisplayOther from './otherpage'
import NotAvaiable from './na'
import Page2 from './page2'


import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ='/size' element={<NotAvaiable />} />
        <Route path="/" element={<DisplayMain />} />
        <Route path="/tespage" element={<Display />} />
        <Route path="/otherpage" element={<DisplayOther />} />
        <Route path="/page2" element={<Page2 />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
