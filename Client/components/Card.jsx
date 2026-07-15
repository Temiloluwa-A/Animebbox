import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import useAnimeStore from '../store/useAnimeStore'
import useAuthStore from '../store/useAuthStore'
import api from '../lib/api'
import { Play, Bookmark, ChevronRight, X } from 'lucide-react'

const fetchAnime = async (title, sort, status) => {
  const result = await api.get('/animes', {
    params: { title, sort, status },
  })
  return result.data.data
}


const Card = ({ overrideStatus }) => {
  const { title, sort, status } = useAnimeStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [trailerUrl, setTrailerUrl] = useState(null)   // shared trailer modal

  const effectiveStatus = overrideStatus ?? status
  const effectiveTitle = overrideStatus ? '' : title

  const saveAnime = useMutation({
    mutationFn: (anime) => api.post('/watchlist', {
      malId: anime.mal_id,
      title: anime.title,
      imageUrl: anime.images.jpg.image_url,
      status: anime.status,
    }),
  })

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['animeDetails', effectiveTitle, sort, effectiveStatus],
    queryFn: () => fetchAnime(effectiveTitle, sort, effectiveStatus),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  // Play Trailer if the title has one; otherwise fall through to details.
  const handlePlay = (anime) => {
    const url = anime.trailer?.embed_url
    if (url) setTrailerUrl(url)
    else navigate(`/card-details/${anime.mal_id}`)
  }

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='fh-card animate-pulse'>
            <div className='w-full aspect-[2/3] bg-white/5' />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center gap-4 py-12 text-center'>
        <p className='text-white/60'>Couldn’t load titles — the source is busy right now.</p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className='mainbutton px-5 py-2.5 rounded-lg text-sm disabled:opacity-60'
        >
          {isFetching ? 'Retrying…' : 'Retry'}
        </button>
      </div>
    )
  }
  if (!data || data.length === 0) return <div className='text-white/60 py-8'>No titles found.</div>

  return (
    <>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
        {data.map((anime) => (
          <div key={anime.mal_id} className='fh-card group relative aspect-[2/3] overflow-hidden'>
            {/* Poster */}
            <img
              src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
              alt={anime.title}
              className='absolute inset-0 w-full h-full object-cover'
            />

            
            {/* Save to watchlist — logged-in users, on hover */}
            {user && (
              <button
                onClick={() => saveAnime.mutate(anime, { onSuccess: () => window.alert('Added to watchlist') })}
                disabled={saveAnime.isPending}
                aria-label='Save to watchlist'
                className='absolute top-2 left-2 z-10 p-1.5 rounded-full bg-black/60 backdrop-blur-sm hover:bg-[var(--fh-red)] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all disabled:opacity-60'
              >
                <Bookmark size={14} />
              </button>
            )}

            {/* Hover reveal: play pill (center) + info panel (bottom) */}
            <div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-col'>
              {/* Play Trailer pill */}
              <div className='flex-1 flex items-center justify-center'>
                <button
                  onClick={() => handlePlay(anime)}
                  className='flex items-center gap-2 bg-black/55 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-black/75 transition-colors'
                >
                  <span className='p-1 rounded-full bg-[var(--fh-red)] flex'>
                    <Play size={12} className='fill-white' />
                  </span>
                  Play Trailer
                </button>
              </div>

              {/* Info panel */}
              <div className='p-3 bg-black h-[50%] space-y-3'>
                <h3 className='text-sm font-semibold leading-snug line-clamp-1'>{anime.title}</h3>
                <div className='border-b-1 '/>
                <button
                  onClick={() => navigate(`/card-details/${anime.mal_id}`)}
                  className='mainbutton w-full mt-3 py-3 rounded-md text-xs font-semibold'
                >
                  Buy Tickets
                </button>
                <button
                  onClick={() => navigate(`/card-details/${anime.mal_id}`)}
                  className='flex items-center justify-center w-full gap-1 text-sm text-white/80 hover:text-white transition-colors mt-2'
                >
                  More Info <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trailer modal (shared across cards) */}
      {trailerUrl && (
        <div
          className='fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4'
          onClick={() => setTrailerUrl(null)}
        >
          <div className='relative w-full max-w-4xl aspect-video' onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setTrailerUrl(null)}
              className='absolute -top-11 right-0 flex items-center gap-1 text-white/80 hover:text-white'
              aria-label='Close trailer'
            >
              <X size={22} /> Close
            </button>
            <iframe
              className='w-full h-full rounded-lg border border-white/10'
              src={trailerUrl}
              title='Trailer'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Card
