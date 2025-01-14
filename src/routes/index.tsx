import { AuthGuard } from '@/components/custom';
import { Authenticate, TransferMarket } from '@/pages';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path='/' element={<Navigate to={'/authenticate'} />} />
        <Route path='/authenticate' element={<Authenticate />} />
        {/* private routes */}
        <Route path='/app' element={<AuthGuard />}>
          <Route path='transfer-market' element={<TransferMarket />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
