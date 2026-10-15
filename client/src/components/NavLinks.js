import links from '../utils/links';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const NavLinks = ({ toggleSidebar }) => {
  const { user } = useAppContext();
  const visibleLinks = user?.isDemo
    ? links.filter(({ path }) => !['add-job', 'profile'].includes(path))
    : links;

  return (
    <div className='nav-links'>
      {visibleLinks.map((link) => {
        const { text, path, id, icon } = link;

        return (
          <NavLink
            to={path}
            key={id}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            end
          >
            <span className='icon'>{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavLinks;
