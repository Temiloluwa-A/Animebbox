import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

// Shared layout for pages that sit under the navbar.
// pt-[70px] offsets the fixed 70px Navbar; footer sits below the content.
const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col bg-[var(--fh-bg)]'>
      <Navbar />
      <main className='flex-1 pt-[154px] px-6'>
        <div className='py-6'>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
