import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

const Templates: React.FC = () => {
  const { templates } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">PDF Templates</h1>
        <p className="text-gray-600 mt-1">
          Available insurance and work order templates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => (
          <div key={template.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-6 w-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {template.description}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium capitalize">
                {template.category.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Fields:</span>
                <span className="font-medium text-gray-900">
                  {template.fields.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Required Fields:</span>
                <span className="font-medium text-gray-900">
                  {template.requiredFields.length}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Fields:</h4>
              <div className="space-y-1">
                {template.fields.slice(0, 5).map(field => (
                  <div key={field.id} className="flex items-center text-xs text-gray-600">
                    {field.required ? (
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-gray-400 mr-2" />
                    )}
                    {field.label}
                  </div>
                ))}
                {template.fields.length > 5 && (
                  <p className="text-xs text-gray-500 italic">
                    +{template.fields.length - 5} more fields
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;