import React, { useState } from 'react'
import axios from 'axios'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import api from '../lib/api'
import { ArrowLeft, Play, Bookmark, Star, Clock, Calendar, X } from 'lucide-react'

const fetchAnimeById = async (id) => {
    const result = await axios.get(`http://localhost:5000/api/v1/animes/${id}`)
    return result.data.data
}

const CardDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const [trailerOpen, setTrailerOpen] = useState(false)

    const { data: anime, isLoading, isError } = useQuery({
        queryKey: ['animeDetails', id],
        queryFn: () => fetchAnimeById(id),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    })

    const saveAnime = useMutation({
        mutationFn: (a) => api.post('/watchlist', {
            malId: a.mal_id,
            title: a.title,
            imageUrl: a.images.jpg.image_url,
            status: a.status,
        }),
    })

    if (isLoading) return <div className='text-white/60 py-20 text-center'>Loading...</div>
    if (isError) return <div className='text-white/60 py-20 text-center'>Error fetching details</div>

    const backdrop = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
    const trailerUrl = anime.trailer?.embed_url

    return (
        <div className='max-w-6xl mx-auto pb-16'>
            {/* Cinematic backdrop header */}
            <div className='relative -mx-6 h-[280px] sm:h-[360px] overflow-hidden'>
                <img src={backdrop} alt='' className='w-full h-full object-cover object-top opacity-40' />
                <div className='absolute inset-0 bg-gradient-to-t from-[var(--fh-bg)] via-[var(--fh-bg)]/60 to-transparent' />
                <button
                    onClick={() => navigate(-1)}
                    className='fh-btn-outline absolute top-4 left-6 flex items-center gap-1 px-3 py-1.5 rounded-md text-sm'
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            {/* Poster + info, pulled up over the backdrop */}
            <div className='flex flex-col md:flex-row gap-8 -mt-28 relative px-2'>
                <img
                    src={backdrop}
                    alt={anime.title}
                    className='w-48 sm:w-60 rounded-xl object-cover flex-none shadow-2xl border border-white/10'
                />

                <div className='flex-1 space-y-4 pt-2 md:pt-28'>
                    <h1 className='text-3xl sm:text-4xl font-extrabold'>{anime.title}</h1>

                    <div className='flex flex-wrap items-center gap-4 text-sm text-white/70'>
                        {anime.score && (
                            <span className='flex items-center gap-1'>
                                <Star size={15} className='text-[var(--fh-red)] fill-[var(--fh-red)]' /> {anime.score}/10
                            </span>
                        )}
                        {anime.duration && !anime.duration.startsWith('Unknown') && (
                            <span className='flex items-center gap-1'><Clock size={15} /> {anime.duration}</span>
                        )}
                        {anime.year && <span className='flex items-center gap-1'><Calendar size={15} /> {anime.year}</span>}
                        <span className='fh-badge'>{anime.status}</span>
                    </div>

                    {/* Genres */}
                    {anime.genres?.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                            {anime.genres.map((g) => (
                                <span key={g.mal_id} className='text-xs px-2.5 py-1 rounded-full bg-[var(--fh-surface-2)] text-white/70'>
                                    {g.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <p className='text-sm sm:text-base leading-relaxed text-white/80 max-w-3xl'>{anime.synopsis}</p>

                    <div className='flex flex-wrap gap-3 pt-2'>
                        <button
                            onClick={() => trailerUrl && setTrailerOpen(true)}
                            disabled={!trailerUrl}
                            className='mainbutton flex items-center gap-2 px-6 py-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <Play size={18} className='fill-white' /> Play Trailer
                        </button>
                        <button
                            onClick={() => {
                                if (!user) return navigate('/login')
                                saveAnime.mutate(anime, { onSuccess: () => window.alert('Added to watchlist') })
                            }}
                            disabled={saveAnime.isPending}
                            className='fh-btn-outline flex items-center gap-2 px-6 py-3 rounded-lg text-sm disabled:opacity-60'
                        >
                            <Bookmark size={18} /> Add to Watchlist
                        </button>
                    </div>
                </div>
            </div>

            {/* Trailer modal */}
            {trailerOpen && trailerUrl && (
                <div
                    className='fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4'
                    onClick={() => setTrailerOpen(false)}
                >
                    <div className='relative w-full max-w-4xl aspect-video' onClick={(e) => e.stopPropagation()}>
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

export default CardDetails
