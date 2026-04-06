import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Listings from './pages/Listings'
import DonatePage from './pages/DonatePage'
import Dashboard from './pages/Dashboard'
import Impact from './pages/Impact'
import Volunteers from './pages/Volunteers'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/listings"   element={<Listings />} />
        <Route path="/donate"     element={<DonatePage />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/impact"     element={<Impact />} />
        <Route path="/volunteers" element={<Volunteers />} />
      </Routes>
    </>
  )
}

export default App