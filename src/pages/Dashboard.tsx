import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Briefcase, FileText, CheckCircle } from 'lucide-react';
import JobCard from '../components/JobCard';

const Dashboard: React.FC = () => {
  const { jobs, currentUser } = useApp();

  const stats = {
    total: jobs.length,
    draft: jobs.filter(j => j.status === 'draft').length,
    ready: jobs.filter(j => j.status === 'ready').length,
    submitted: jobs.filter(j => j.status === 'submitted').length,
    approved: jobs.filter(j => j.status === 'approved').length,
  };

  const recentJobs = jobs.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {currentUser.name}</p>
        </div>
        <Link to="/jobs/new" className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Briefcase className="h-12 w-12 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ready to Submit</p>
              <p className="text-3xl font-bold text-blue-600">{stats.ready}</p>
            </div>
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Submitted</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.submitted}</p>
            </div>
            <FileText className="h-12 w-12 text-yellow-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Jobs</h2>
          <Link to="/jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </Link>
        </div>

        {recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first job</p>
            <Link to="/jobs/new" className="btn-primary inline-flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create Job
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;