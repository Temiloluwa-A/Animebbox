import React from 'react'
import { Apple, Play } from 'lucide-react'

// lucide v1 dropped brand icons, so we inline minimal brand marks for socials.
const Facebook = (props) => (
  <svg viewBox='0 0 24 24' width='16' height='16' fill='currentColor' {...props}>
    <path d='M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z' />
  </svg>
)
const Instagram = (props) => (
  <svg viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <rect x='2' y='2' width='20' height='20' rx='5' /><path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z' /><line x1='17.5' y1='6.5' x2='17.51' y2='6.5' />
  </svg>
)
const Twitter = (props) => (
  <svg viewBox='0 0 24 24' width='16' height='16' fill='currentColor' {...props}>
    <path d='M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.3L17.61 20.65Z' />
  </svg>
)


const Footer = () => {
  return (
    <footer className='bg-black border-t border-white/10 mt-16'>
      <div className='max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8'>
        {/* Brand + app badges */}
        <div className='col-span-2 md:col-span-1'>
          <span className='text-2xl tracking-tight'>
            <span className='font-extrabold'>film</span><span className='font-light'>house</span>
          </span>
          
          
        </div>

        {/* Company */}
        <div>
          <h4 className='text-sm font-semibold mb-3'>Company</h4>
          <ul className='space-y-2 text-sm text-white/60'>
            <li><a href='#' className='hover:text-white transition-colors'>About Us</a></li>
            <li><a href='#' className='hover:text-white transition-colors'>Ticket Prices</a></li>
            <li><a href='#' className='hover:text-white transition-colors'>Experiences</a></li>
            <li><a href='#' className='hover:text-white transition-colors'>The Cube</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className='text-sm font-semibold mb-3'>Support</h4>
          <ul className='space-y-2 text-sm text-white/60'>
            <li><a href='#' className='hover:text-white transition-colors'>FAQs</a></li>
            <li><a href='#' className='hover:text-white transition-colors'>Contact Us</a></li>
            <li><a href='#' className='hover:text-white transition-colors'>Privacy Policy</a></li>
            <li><a href='#' className='hover:text-white transition-colors'>Terms &amp; Conditions</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className='text-sm font-semibold mb-3'>Follow Us</h4>
          <div className='flex gap-3'>
            <a href='#' className='p-2 rounded-full bg-[var(--fh-surface-2)] hover:bg-[var(--fh-red)] transition-colors'><Facebook size={16} /></a>
            <a href='#' className='p-2 rounded-full bg-[var(--fh-surface-2)] hover:bg-[var(--fh-red)] transition-colors'><Instagram size={16} /></a>
            <a href='#' className='p-2 rounded-full bg-[var(--fh-surface-2)] hover:bg-[var(--fh-red)] transition-colors'><Twitter size={16} /></a>
          </div>
        </div>
      </div>

      <div className='border-t border-white/10'>
        <div className='max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40'>
          <p> 2026 Filmhouse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
