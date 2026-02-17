import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/app/ProtectedRoute';
import { AppLayout } from '@/app/AppLayout';
import App from './App';
import { LoginPage } from '@/app/pages/LoginPage';
import { DashboardPage } from '@/app/pages/DashboardPage';
import { CreateProjectPage } from '@/app/pages/CreateProjectPage';
import { ProjectPage } from '@/app/pages/ProjectPage';
import { CardsPage } from '@/app/pages/CardsPage';
import { TestPage } from '@/app/pages/TestPage';
import { TestResultsPage } from '@/app/pages/TestResultsPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="projects/new" element={<CreateProjectPage />} />
            <Route path="projects/:projectId" element={<ProjectPage />} />
            <Route path="projects/:projectId/cards" element={<CardsPage />} />
            <Route path="projects/:projectId/test" element={<TestPage />} />
            <Route path="projects/:projectId/test/results" element={<TestResultsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
