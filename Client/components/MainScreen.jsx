import React from 'react'
import Card from './Card'
import Hero from './Hero'
import useAnimeStore from '../store/useAnimeStore'

const MainScreen = () => {
  const { sort, setSort, status, setStatus } = useAnimeStore()

  return (
    <div className='max-w-7xl mx-auto pb-8'>
      {/* Featured banner */}
      <Hero />

      {/* Now Showing */}
      <section className='mt-12'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
          <h2 className='fh-section-title'>Now Showing</h2>

          <div className='flex items-center gap-2'>
            <select
              id='sort'
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className='fh-select'
            >
              <option value='default'>Sort by</option>
              <option value='popularity'>Popularity</option>
              <option value='score'>Favorites</option>
              <option value='rank'>Rank</option>
            </select>
            <select
              id='status'
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className='fh-select'
            >
              <option value='default'>Status</option>
              <option value='completed'>Completed</option>
              <option value='airing'>Airing</option>
              <option value='upcoming'>Upcoming</option>
            </select>
          </div>
        </div>

        <Card />
      </section>
    </div>
  )
}

export default MainScreen
