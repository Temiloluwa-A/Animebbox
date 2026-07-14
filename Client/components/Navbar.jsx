import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAnimeStore from '../store/useAnimeStore'
import useAuthStore from '../store/useAuthStore'
import { Search, MapPin, ChevronDown, LogOut, User, ShoppingCart } from 'lucide-react'

const LOCATIONS = ['PLEASE SELECT LOCATION','Lekki IMAX', 'Landmark', 'Palms Lekki', 'Surulere', 'Apapa', 'Ikeja']

const Navbar = () => {
  const { setTitle } = useAnimeStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const [term, setTerm] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [location, setLocation] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setTitle(term), 500)
    return () => clearTimeout(id)
  }, [term, setTitle])

  // Collapse the top announcement strip once the user scrolls down.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  return (
    <header className='fixed top-0 inset-x-0 z-50 bg-black'>
      {/* Top announcement / utility strip — collapses away on scroll */}
      <div className={`bg-[var(--fh-red)] text-white flex items-center justify-center text-xs sm:text-sm px-4 text-center overflow-hidden transition-all duration-300 ${scrolled ? 'h-0 opacity-0' : 'h-[34px] opacity-100'}`}>
        {user ? (
          <span>Welcome back, {user.firstName} — enjoy the show 🍿</span>
        ) : (
          <span>
            <button onClick={() => navigate('/login')} className='underline font-semibold hover:opacity-90'>Login</button>
            {' '}to enjoy more benefits
          </span>
        )}
      </div>
      <nav className='max-w-7xl mx-auto h-[70px] flex items-center gap-4 px-4 sm:px-6'>
        <Link to='/' className='flex items-center gap-2 shrink-0'>
           <img src="logo.png" alt="" style={{width: 30}} />
          <span className='text-2xl'>
            {/* <img src="logo.png" alt="" style={{width: 30}} /> */}
            <span className='font-extrabold text-white'>film</span>
            <span className='font-light text-white'>house</span>
          </span>
        </Link>

        {/* Primary links (decorative — Filmhouse chrome, no destination) */}
        <div className='hidden lg:flex items-center gap-7 ml-6'>
          <span className='text-sm text-white/70 hover:text-white transition-colors cursor-pointer'>Buy Tickets</span>
          <span className='text-sm text-white/70 hover:text-white transition-colors cursor-pointer'>Food & Drinks</span>
          <span className='text-sm text-white/70 hover:text-white transition-colors cursor-pointer'>The Cube</span>
        </div>

        <div className='flex items-center'>
            {searchOpen && (
              <input
                autoFocus
                type='text'
                value={term}
                placeholder='Search titles...'
                onChange={(e) => setTerm(e.target.value)}
                className='w-36 sm:w-56 h-9 rounded-md px-3 text-sm bg-[var(--fh-surface-2)] border border-white/10 focus:outline-none focus:border-[var(--fh-red)] mr-2'
              />
            )}
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className='p-2.5 rounded-md bg-[var(--fh-surface-2)] hover:bg-[#2a2a2a] transition-colors'
              aria-label='Search'
            >
              <Search size={16} />
            </button>
          </div>

        {/* Right cluster */}
        <div className='flex items-center gap-2 sm:gap-3 ml-auto'>
          {/* Auth */}
          {user ? (
            <div className='flex items-center gap-2 sm:gap-3'>
              <button
                onClick={() => navigate('/watchlist')}
                className='hidden sm:block text-sm text-white/70 hover:text-white transition-colors'
              >
                My List
              </button>
              <span className='hidden md:flex items-center gap-1 text-sm'>
                <User size={15} className='text-[var(--fh-red)]' />
                {user.firstName}
              </span>
              <button
                onClick={() => { logout(); navigate('/') }}
                className='fh-btn-outline flex items-center gap-1 px-3 py-1.5 rounded-md text-sm'
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          ) : (
            <div className='flex items-center gap-2 sm:gap-3'>
              <LogOut size={18} />
              <button
                onClick={() => navigate('/login')}
                className='text-sm text-white/70 hover:text-white transition-colors'
              >
                
                Sign in
              </button>
              <ShoppingCart size={18} />
            </div>
          )}
        </div>
      </nav>

      {/* Secondary bar: location (left) + placeholders (right); gray line below */}
      <div className='border-t border-white/10 border-b border-white/20'>
        <div className='max-w-7xl mx-auto h-[48px] flex items-center justify-between px-4 sm:px-6'>

          <div className='flex items-center gap-1 text-lg border border-white py-2 px-4 font-bold bg-gray-600'>
            <MapPin size={20}  />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className='bg-transparent text-white text-sm outline-none appearance-none pr-4  cursor-pointer'
            >
              <option value='' disabled hidden>PLEASE SELECT A LOCATION:</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className='bg-[#1e1e1e]'>{loc}</option>
              ))}
            </select>
            <ChevronDown size={20} className=' pointer-events-none' />
          </div>

          <div className='flex items-center gap-6 text-sm text-white/70'>
            <span className='cursor-pointer hover:text-white transition-colors'>Gift Cards</span>
            <span className='cursor-pointer hover:text-white transition-colors'>Buy Food</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
