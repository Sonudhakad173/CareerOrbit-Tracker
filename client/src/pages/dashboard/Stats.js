import { useEffect } from 'react'
import { useAppContext } from '../../context/appContext'
import {
  StatsContainer,
  Loading,
  ChartsContainer,
  StatusChart,
} from '../../components'
import DashboardCharts from '../../assets/wrappers/DashboardCharts'

const Stats = () => {
  const { showStats, isLoading, monthlyApplications } = useAppContext()

  useEffect(() => {
    showStats()
    // eslint-disable-next-line
  }, [])
  if (isLoading) {
    return <Loading center />
  }
  return (
    <>
      <StatsContainer />
      <DashboardCharts className={monthlyApplications.length > 0 ? '' : 'single-chart'}>
        <StatusChart />
        {monthlyApplications.length > 0 && <ChartsContainer />}
      </DashboardCharts>
    </>
  )
}

export default Stats
