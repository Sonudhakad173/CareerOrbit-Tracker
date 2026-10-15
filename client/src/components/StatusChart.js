import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/StatusChart'

const STATUS_COLORS = {
  pending: '#e9b949',
  interview: '#647acb',
  declined: '#d66a6a',
}

const StatusChart = () => {
  const { stats } = useAppContext()
  const data = [
    { name: 'Pending', count: stats.pending || 0, color: STATUS_COLORS.pending },
    { name: 'Interview', count: stats.interview || 0, color: STATUS_COLORS.interview },
    { name: 'Declined', count: stats.declined || 0, color: STATUS_COLORS.declined },
  ]
  const chartData = data.filter((item) => item.count > 0)
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Wrapper>
      <h4>Current Status</h4>
      <div className='status-chart-content'>
        <div className='status-donut'>
          {total > 0 ? (
            <ResponsiveContainer width='100%' height={260}>
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Pie
                  data={chartData}
                  dataKey='count'
                  nameKey='name'
                  cx='50%'
                  cy='48%'
                  innerRadius={52}
                  outerRadius={75}
                  paddingAngle={3}
                  stroke='none'
                >
                  {chartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} jobs`, 'Applications']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className='empty-chart'>No applications yet</div>
          )}
          {total > 0 && (
            <div className='donut-total' aria-label={`${total} total applications`}>
              <strong>{total}</strong>
              <span>total</span>
            </div>
          )}
        </div>
        <ul className='status-legend'>
          {data.map((item) => (
            <li key={item.name}>
              <span className='status-name'>
                <span className='legend-dot' style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      </div>
    </Wrapper>
  )
}

export default StatusChart
