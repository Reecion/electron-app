import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/login/page'
import Layout from './pages/layout/page'
import { StrictMode } from 'react'

function App() {
  return (
    <StrictMode>
      <HashRouter>
        <Routes>
          <Route path={'/'} element={<LoginPage />} ></Route>
          <Route path={'/app'} element={<Layout />} ></Route>
        </Routes>
      </HashRouter>,
    </StrictMode>
  )
}

export default App
