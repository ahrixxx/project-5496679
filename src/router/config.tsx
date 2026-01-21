import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const Home = lazy(() => import('../pages/home/page'));
const Insights = lazy(() => import('../pages/insights/page'));
const Analytics = lazy(() => import('../pages/analytics/page'));
const Portfolio = lazy(() => import('../pages/portfolio/page'));
const TradeDetail = lazy(() => import('../pages/trade-detail/page'));
const StockDetail = lazy(() => import('../pages/stock-detail/page'));
const Auth = lazy(() => import('../pages/auth/page'));
const NotFound = lazy(() => import('../pages/NotFound'));
import SectorOutlook from '../pages/sector-outlook/page';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/insights',
    element: <Insights />
  },
  {
    path: '/analytics',
    element: <Analytics />
  },
  {
    path: '/portfolio',
    element: <Portfolio />
  },
  {
    path: '/trade/:id',
    element: <TradeDetail />
  },
  {
    path: '/stock/:ticker',
    element: <StockDetail />
  },
  {
    path: '/sector-outlook',
    element: <SectorOutlook />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
