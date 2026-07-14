import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

// if there's no token, send them to login instead of showing the page
const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to='/login' replace />
}

export default ProtectedRoute
