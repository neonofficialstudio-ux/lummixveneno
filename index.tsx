import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { RequireAdmin } from './components/admin/RequireAdmin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLeads } from './pages/admin/AdminLeads';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminPortfolio } from './pages/admin/AdminPortfolio';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminLeads />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
