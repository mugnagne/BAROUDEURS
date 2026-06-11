/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { BlogPage } from './pages/BlogPage';
import { PostPage } from './pages/PostPage';
import { EditorPage } from './pages/EditorPage';
import { WorldCupPage } from './pages/WorldCupPage';
import { TeamsPage } from './pages/TeamsPage';
import { AdminPage } from './pages/AdminPage';
import { CalendarPage } from './pages/CalendarPage';
import { AuthProvider } from './lib/auth';

import { WelcomePopup } from './components/WelcomePopup';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <WelcomePopup />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:id" element={<PostPage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="editor/:id" element={<EditorPage />} />
            <Route path="world-cup" element={<WorldCupPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
