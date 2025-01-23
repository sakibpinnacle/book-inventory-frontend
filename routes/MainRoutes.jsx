import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
// import book from 'pages/component-overview/BookTable';
import { element } from 'prop-types';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Book = Loadable(lazy(() => import('pages/component-overview/BookTable')));
const Category = Loadable(lazy(()=>import('pages/component-overview/Category.jsx')));
const Author = Loadable(lazy(()=>import('pages/component-overview/Author.jsx')));

const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const AuthLogout = Loadable(lazy(() => import('pages/authentication/auth-forms/Logout')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path:'author',
      element:<Author/>
    },
    {
      path:'book',
      element:<Book/>
    }
  ,
  {
    path:'category',
    element:<Category/>
  }
  ,
  {
    path:'logout',
    element:<AuthLogout/>
  }

  ]
};

export default MainRoutes;
