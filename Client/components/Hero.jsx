import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Play, Info, Star, X, ChevronLeft, ChevronRight } from 'lucide-react'

// Featured banner carousel, Filmhouse-style. Pulls the most popular titles
// and rotates through them as full-bleed hero slides, each with a real
// "Play Trailer" action (Jikan provides a YouTube embed url per title).
const fetchFeatured = async () => {
  const res = await axios.get('http://localhost:5000/api/v1/animes/top')
  return res.data.data
}

const Hero = () => {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [trailerOpen, setTrailerOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['featuredAnime'],
    queryFn: fetchFeatured,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })

  const slides = (data || []).slice(0, 5)

  // Auto-advance every 6s, but pause while a trailer is playing.
  useEffect(() => {
    if (slides.length < 2 || trailerOpen) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000)
    return () => clearInterval(id)
  }, [slides.length, trailerOpen])

  // Close the trailer if we somehow navigate between slides.
  useEffect(() => { setTrailerOpen(false) }, [index])

  // Graceful fallback so the page always looks intentional if the API is flaky.
  if (isLoading || isError || slides.length === 0) {
    return (
      <div className='relative h-[420px] sm:h-[520px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-black flex items-center'>
        <div className='px-8 sm:px-14 max-w-2xl'>
          <span className='fh-badge mb-4'>FEATURED</span>
          <h1 className='text-4xl sm:text-6xl font-extrabold leading-tight mt-4'>
            The best of <span className='text-[var(--fh-red)]'>anime</span>, on the big screen.
          </h1>
          <p className='text-white/60 mt-4'>
            {isLoading ? 'Loading featured titles…' : 'Featured titles are taking a break — check the collection below.'}
          </p>
        </div>
      </div>
    )
  }

  const anime = slides[index]
  const backdrop = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
  const trailerUrl = anime.trailer?.embed_url

  return (
    <div className='relative h-[420px] sm:h-[520px] rounded-2xl overflow-hidden'>
      {/* Backdrop */}
      <img
        src={backdrop}
        alt={anime.title}
        className='absolute inset-0 w-full h-full object-cover'
      />
      {/* Cinematic gradient scrims for legible text */}
      <div className='absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent' />
      <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent' />

      {/* Content */}
      <div className='relative h-full flex flex-col justify-center px-8 sm:px-14 max-w-2xl'>
        <div className='flex items-center gap-3 mb-4'>
          <span className='fh-badge'>FEATURED</span>
          {anime.score && (
            <span className='flex items-center gap-1 text-sm text-white/80'>
              <Star size={14} className='text-[var(--fh-red)] fill-[var(--fh-red)]' /> {anime.score}
            </span>
          )}
        </div>

        <h1 className='text-3xl sm:text-5xl font-extrabold leading-tight line-clamp-2'>
          {anime.title}
        </h1>

        <p className='text-white/70 mt-4 text-sm sm:text-base line-clamp-3 max-w-xl'>
          {anime.synopsis}
        </p>

        <div className='flex gap-3 mt-7'>
          {trailerUrl ? (
            <button
              onClick={() => setTrailerOpen(true)}
              className='mainbutton flex items-center gap-2 px-6 py-3 rounded-lg text-sm sm:text-base'
            >
              <Play size={18} className='fill-white' /> Play Trailer
            </button>
          ) : (
            <button
              onClick={() => navigate(`/card-details/${anime.mal_id}`)}
              className='mainbutton flex items-center gap-2 px-6 py-3 rounded-lg text-sm sm:text-base'
            >
              <Info size={18} /> View Details
            </button>
          )}
          <button
            onClick={() => navigate(`/card-details/${anime.mal_id}`)}
            className='fh-btn-outline flex items-center gap-2 px-6 py-3 rounded-lg text-sm sm:text-base'
          >
            <Info size={18} /> More Info
          </button>
        </div>
      </div>

      {/* Prev / next arrows at the ends of the carousel */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            aria-label='Previous slide'
            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 px-3 py-8 rounded-lg bg-black/50 backdrop-blur-sm'
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            aria-label='Next slide'
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 px-3 py-8 rounded-lg bg-black/50 backdrop-blur-sm'
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Trailer modal */}
      {trailerOpen && trailerUrl && (
        <div
          className='fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4'
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className='relative w-full max-w-4xl aspect-video'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setTrailerOpen(false)}
              className='absolute -top-11 right-0 flex items-center gap-1 text-white/80 hover:text-white'
              aria-label='Close trailer'
            >
              <X size={22} /> Close
            </button>
            <iframe
              className='w-full h-full rounded-lg border border-white/10'
              src={trailerUrl}
              title={`${anime.title} trailer`}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Hero
