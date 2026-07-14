import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'
import MainScreen from '../components/MainScreen'
import CardDetails from '../components/CardDetails'
import Register from '../components/Register'
import Login from '../components/Login'
import Watchlist from '../components/Watchlist'
import ProtectedRoute from '../components/ProtectedRoute'

const App = () => {
  return (
    <div className='min-h-screen bg-[var(--fh-bg)] text-white'>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<MainScreen />} />
            <Route path='/card-details/:id' element={<CardDetails />} />

            {/* Watchlist needs the navbar AND login */}
            <Route path='/watchlist' element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
          </Route>

          {/* Auth pages have no navbar */}
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
    </div>
  )
}

export default App
