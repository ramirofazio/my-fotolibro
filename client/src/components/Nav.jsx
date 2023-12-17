import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';

export function Nav() {
  const routes = useApp().getSteps();
  let pathname = useLocation().pathname.split('/');
  pathname = pathname[pathname.length - 1];

  return (
    <nav className="border-2  border-black grid grid-cols-3 gap-2 px-1">
      {routes.map(({ to, text, access }, i) => (
        <ContainerLink
          to={to}
          key={i}
          index={i}
          access={access}
          current={pathname === to}
        >
          <div
            className={`justify-self-center cur rounded-full text-4xl w-fit py-2 px-4 bg-blue-700`}
          >
            <p>{i + 1}</p>
          </div>
          <p className="text-center text-xl md:text-4xl">{text}</p>
        </ContainerLink>
      ))}
    </nav>
  );
}

const ContainerLink = ({ children, access = true, to, current, index }) => {
  const className = `flex flex-col rounded-md bg-base items-center py-2 border-2 ${
    current
      ? 'border-white bg-gray-500 cursor-default'
      : ' border-black opacity-30'
  }  ${access ? 'cursor-pointer' : 'cursor-no-drop'}`;

  if (!access)
    return (
      <div
        onClick={() => toast.error('Complete el paso ' + index)}
        className={className}
      >
        {children}
      </div>
    );
  else
    return (
      <NavLink to={to} className={className}>
        {children}
      </NavLink>
    );
};
