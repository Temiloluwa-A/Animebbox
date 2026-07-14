import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

const Watchlist = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => (await api.get('/watchlist')).data.data,
  })

  // after removing, refetch the list so the item disappears
  const removeMutation = useMutation({
    mutationFn: (malId) => api.delete(`/watchlist/${malId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] }),
  })

  if (isLoading) return <div className='text-white/60 py-20 text-center'>Loading...</div>
  if (isError) return <div className='text-white/60 py-20 text-center'>Could not load your watchlist</div>

  return (
    <div className='max-w-7xl mx-auto text-white pb-10'>
      <h1 className='fh-section-title mb-8'>My Watchlist</h1>

      {data.length === 0 ? (
        <p className='text-white/60 py-10'>Nothing saved yet. Add titles from the home page.</p>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
          {data.map((anime) => (
            <div key={anime.mal_id} className='fh-card group flex flex-col'>
              <div className='relative aspect-[2/3] overflow-hidden'>
                <img src={anime.image_url} alt={anime.title} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
                <span className='fh-badge absolute top-2 left-2 bg-black/60 backdrop-blur-sm'>{anime.status}</span>
              </div>
              <div className='p-3 flex flex-col gap-2 flex-1'>
                <h3 className='text-sm font-semibold leading-snug line-clamp-1'>{anime.title}</h3>
                <div className='flex gap-2 mt-auto pt-2'>
                  <button
                    className='mainbutton flex-1 px-2 py-1.5 rounded-md text-xs'
                    onClick={() => navigate(`/card-details/${anime.mal_id}`)}
                  >
                    View
                  </button>
                  <button
                    className='fh-btn-outline px-2 py-1.5 rounded-md text-xs disabled:opacity-60'
                    onClick={() => removeMutation.mutate(anime.mal_id)}
                    disabled={removeMutation.isPending}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist
