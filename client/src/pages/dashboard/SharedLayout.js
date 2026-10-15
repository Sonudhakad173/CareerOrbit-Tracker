import { Outlet } from 'react-router-dom'
import Wrapper from '../../assets/wrappers/SharedLayout'
import { Navbar, BigSidebar, SmallSidebar } from '../../components'
import { useAppContext } from '../../context/appContext'
const SharedLayout = () => {
  const { user } = useAppContext()

  return (
    <Wrapper>
      <main className='dashboard'>
        <SmallSidebar />
        <BigSidebar />
        <div>
          <Navbar />
          <div className='dashboard-page'>
            {user?.isDemo && (
              <div className='demo-notice' role='status'>
                Demo account: these sample applications are read-only. Register
                to track your own applications.
              </div>
            )}
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  )
}

export default SharedLayout
