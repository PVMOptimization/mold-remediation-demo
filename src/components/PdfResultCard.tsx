import React, { useState } from 'react';
import type { PdfGenerationResult } from '../types';
import { Download, Mail, CheckCircle, AlertCircle, X } from 'lucide-react';
import { downloadPdf } from '../utils/pdfGenerator';

interface PdfResultCardProps {
  result: PdfGenerationResult;
  adjusterEmail?: string;
  jobId: string;
}

const PdfResultCard: React.FC<PdfResultCardProps> = ({ result, adjusterEmail, jobId }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleDownload = () => {
    const filename = `${jobId}_${result.templateName.replace(/\s+/g, '_')}.pdf`;
    downloadPdf(result.pdfUrl, filename);
  };

  const handleSendEmail = () => {
    // Simulate sending email
    setTimeout(() => {
      setEmailSent(true);
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailSent(false);
      }, 2000);
    }, 1000);
  };

  const completionPercentage = Math.round((result.fieldsPopulated / result.totalFields) * 100);

  return (
    <>
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{result.templateName}</h3>
            <p className="text-sm text-gray-500">Generated {new Date(result.generatedAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-2">
            {result.missingFields.length === 0 ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-500" />
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Fields Populated</span>
            <span className="font-medium text-gray-900">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {result.fieldsPopulated} of {result.totalFields} fields filled
          </p>
        </div>

        {result.missingFields.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-1">Missing Required Fields:</p>
            <ul className="text-xs text-yellow-700 list-disc list-inside">
              {result.missingFields.map((field, idx) => (
                <li key={idx}>{field}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex space-x-3">
          <button onClick={handleDownload} className="btn-primary flex-1 flex items-center justify-center">
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
          {adjusterEmail && (
            <button
              onClick={() => setShowEmailModal(true)}
              className="btn-secondary flex-1 flex items-center justify-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send to Adjuster
            </button>
          )}
        </div>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Send to Adjuster</h3>
              <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {!emailSent ? (
                <>
                  <div className="mb-4">
                    <label className="label">To:</label>
                    <input
                      type="email"
                      value={adjusterEmail}
                      disabled
                      className="input-field bg-gray-100"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="label">Subject:</label>
                    <input
                      type="text"
                      value={`Insurance Documentation - Job ${jobId}`}
                      disabled
                      className="input-field bg-gray-100"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="label">Attachment:</label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                      {result.templateName}.pdf
                    </div>
                  </div>
                  <button onClick={handleSendEmail} className="btn-primary w-full">
                    Send Email
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">Email Sent!</p>
                  <p className="text-sm text-gray-600 mt-1">PDF has been sent to adjuster</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PdfResultCard;