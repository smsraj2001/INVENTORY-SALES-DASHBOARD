import React from 'react'
import DashboardCards from './DashboardCards'
import Charts from './Charts'
import Updates from './Updates'

const Home = () => {
  return (
    <div>
      <DashboardCards />
      <Charts />
      <Updates />
      {/* <Carousel /> */}
    </div>
  )
}

export default Home