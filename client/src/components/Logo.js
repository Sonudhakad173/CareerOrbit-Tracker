import logo from '../assets/images/logo.svg'

const Logo = ({ showName = true }) => {
  return (
    <div className='brand-logo' aria-label={showName ? 'CareerOrbit Tracker' : undefined}>
      <img src={logo} alt='' aria-hidden='true' className='brand-mark' />
      {showName && <span className='brand-name'>CareerOrbit Tracker</span>}
    </div>
  )
}

export default Logo
