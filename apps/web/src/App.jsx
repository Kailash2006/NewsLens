import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import FeedPage from './pages/FeedPage.jsx';
import StoriesPage from './pages/StoriesPage.jsx';
import BundlesPage from './pages/BundlesPage.jsx';
import SourcesPage from './pages/SourcesPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/bundles" element={<BundlesPage />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<div className="py-24 text-center text-slate-500">Page not found.</div>} />
      </Routes>
    </Layout>
  );
}
