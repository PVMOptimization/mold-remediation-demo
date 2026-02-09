import React, { useState } from 'react';
import type { PdfTemplate } from '../types';
import { X, FileText, CheckCircle } from 'lucide-react';

interface TemplateSelectionModalProps {
  templates: PdfTemplate[];
  onClose: () => void;
  onGenerate: (selectedTemplateIds: string[]) => void;
}

const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  templates,
  onClose,
  onGenerate,
}) => {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const toggleTemplate = (templateId: string) => {
    setSelectedTemplates(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Select PDF Templates</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid gap-4">
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => toggleTemplate(template.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTemplates.includes(template.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary-600" />
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      {selectedTemplates.includes(template.id) && (
                        <CheckCircle className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {template.fields.length} fields
                      </span>
                      <span className="text-xs text-gray-500">
                        {template.requiredFields.length} required
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {selectedTemplates.length} template{selectedTemplates.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex space-x-3">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={() => onGenerate(selectedTemplates)}
              disabled={selectedTemplates.length === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate PDFs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionModal;