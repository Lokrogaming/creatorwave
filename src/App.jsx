import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import News from './pages/News.jsx'
import Regeln from './pages/Regeln.jsx'
import Faq from './pages/Faq.jsx'
import Support from './pages/Support.jsx'
import Appeal from './pages/Appeal.jsx'
import { Datenschutz, Impressum } from './pages/Legal.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="news" element={<News />} />
          <Route path="regeln" element={<Regeln />} />
          <Route path="faq" element={<Faq />} />
          <Route path="support" element={<Support />} />
          <Route path="appeal" element={<Appeal />} />
          <Route path="impressum" element={<Impressum />} />
          <Route path="datenschutz" element={<Datenschutz />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
