import React from 'react';
import type { Job } from '../types';
import { format } from 'date-fns';
import { MapPin, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    ready: 'bg-blue-100 text-blue-800',
    submitted: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
  };

  return (
    <Link to={`/jobs/${job.id}`}>
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.id}</h3>
            <p className="text-sm text-gray-600">{job.customer.name}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {job.property.street}, {job.property.city}, {job.property.state}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Loss Date: {format(job.lossInfo.lossDate, 'MM/dd/yyyy')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-2" />
            {job.files.length} files attached
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Created {format(job.createdAt, 'MMM dd, yyyy')}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;