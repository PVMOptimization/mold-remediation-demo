import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Search } from 'lucide-react';
import JobCard from '../components/JobCard';

const JobsList: React.FC = () => {
  const { jobs } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredJobs = jobs.filter(job =>
    job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.property.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Jobs</h1>
        <Link to="/jobs/new" className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          New Job
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs by ID, customer name, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600">No jobs found</p>
        </div>
      )}
    </div>
  );
};

export default JobsList;