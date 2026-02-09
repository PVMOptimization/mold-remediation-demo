
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import JobsList from './pages/JobsList';
import NewJob from './pages/NewJob';
import JobDetail from './pages/JobDetail';
import Templates from './pages/Templates';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/jobs/new" element={<NewJob />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/templates" element={<Templates />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;