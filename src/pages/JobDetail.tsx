import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Job, MoistureReading, AirSample, Photo } from '../types';
import { ArrowLeft, Save, FileText, Camera, Droplet, Wind, Plus, Trash2 } from 'lucide-react';
import TemplateSelectionModal from '../components/TemplateSelectionModal.tsx';
import PdfResultCard from '../components/PdfResultCard';
import { mapJobDataToPdfTemplate } from '../utils/pdfGenerator';
import type { PdfGenerationResult } from '../types';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, updateJob, templates } = useApp();

  const [job, setJob] = useState<Job | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [generatedPdfs, setGeneratedPdfs] = useState<PdfGenerationResult[]>([]);
  const [activeTab, setActiveTab] = useState<'inspection' | 'moisture' | 'air' | 'photos' | 'pdfs'>('inspection');

  // Moisture reading form
  const [moistureForm, setMoistureForm] = useState({
    room: '',
    surfaceMaterial: 'drywall' as const,
    moisturePercentage: 0,
    inspectorInitials: '',
    notes: '',
  });

  // Air sample form
  const [airSampleForm, setAirSampleForm] = useState({
    location: '',
    sampleType: 'spore_trap' as const,
    labName: '',
    coloniesPerM3: 0,
    exceedsOutdoorControl: false,
  });

  useEffect(() => {
    const foundJob = jobs.find(j => j.id === id);
    if (foundJob) {
      setJob(foundJob);
    } else {
      navigate('/jobs');
    }
  }, [id, jobs, navigate]);

  if (!job) return null;

  const handleSave = () => {
    updateJob(job);
    alert('Job saved successfully!');
  };

  const addMoistureReading = () => {
    if (!moistureForm.room || !moistureForm.inspectorInitials) {
      alert('Please fill in room and inspector initials');
      return;
    }

    const newReading: MoistureReading = {
      id: `mr-${Date.now()}`,
      ...moistureForm,
      readingDate: new Date(),
    };

    setJob({
      ...job,
      inspection: {
        ...job.inspection,
        moistureReadings: [...job.inspection.moistureReadings, newReading],
      },
    });

    setMoistureForm({
      room: '',
      surfaceMaterial: 'drywall',
      moisturePercentage: 0,
      inspectorInitials: '',
      notes: '',
    });
  };

  const removeMoistureReading = (id: string) => {
    setJob({
      ...job,
      inspection: {
        ...job.inspection,
        moistureReadings: job.inspection.moistureReadings.filter(mr => mr.id !== id),
      },
    });
  };

  const addAirSample = () => {
    if (!airSampleForm.location || !airSampleForm.labName) {
      alert('Please fill in location and lab name');
      return;
    }

    const newSample: AirSample = {
      id: `as-${Date.now()}`,
      ...airSampleForm,
      sampleDate: new Date(),
      resultsReceived: true,
      moldTypesDetected: [],
    };

    setJob({
      ...job,
      inspection: {
        ...job.inspection,
        airSamples: [...job.inspection.airSamples, newSample],
      },
    });

    setAirSampleForm({
      location: '',
      sampleType: 'spore_trap',
      labName: '',
      coloniesPerM3: 0,
      exceedsOutdoorControl: false,
    });
  };

  const removeAirSample = (id: string) => {
    setJob({
      ...job,
      inspection: {
        ...job.inspection,
        airSamples: job.inspection.airSamples.filter(as => as.id !== id),
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: Photo = {
          id: `photo-${Date.now()}-${Math.random()}`,
          filename: file.name,
          url: reader.result as string,
          category: 'damage',
          capturedAt: new Date(),
        };

        setJob({
          ...job,
          inspection: {
            ...job.inspection,
            photos: [...job.inspection.photos, newPhoto],
          },
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id: string) => {
    setJob({
      ...job,
      inspection: {
        ...job.inspection,
        photos: job.inspection.photos.filter(p => p.id !== id),
      },
    });
  };

  const handleGeneratePdfs = (selectedTemplateIds: string[]) => {
    const results = selectedTemplateIds.map(templateId => {
      const template = templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');
      return mapJobDataToPdfTemplate(job, template);
    });

    setGeneratedPdfs(results);
    setShowTemplateModal(false);
    setActiveTab('pdfs');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>
        <div className="flex space-x-3">
          <button onClick={handleSave} className="btn-secondary flex items-center">
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="btn-primary flex items-center"
          >
            <FileText className="h-5 w-5 mr-2" />
            Generate Insurance Docs
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.id}</h1>
            <p className="text-gray-600 mt-1">{job.customer.name}</p>
            <p className="text-sm text-gray-500">
              {job.property.street}, {job.property.city}, {job.property.state}
            </p>
          </div>
          <select
            value={job.status}
            onChange={(e) => setJob({ ...job, status: e.target.value as any })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="draft">Draft</option>
            <option value="ready">Ready</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          {[
            { id: 'inspection', label: 'Inspection Details', icon: FileText },
            { id: 'moisture', label: 'Moisture Readings', icon: Droplet },
            { id: 'air', label: 'Air Samples', icon: Wind },
            { id: 'photos', label: 'Photos', icon: Camera },
            { id: 'pdfs', label: 'Generated PDFs', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 border-b-2 transition-colors flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inspection Details Tab */}
      {activeTab === 'inspection' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Inspection Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Inspection Date</label>
              <input
                type="date"
                value={job.inspection.inspectionDate.toISOString().split('T')[0]}
                onChange={(e) => setJob({
                  ...job,
                  inspection: { ...job.inspection, inspectionDate: new Date(e.target.value) }
                })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Inspector Name</label>
              <input
                type="text"
                value={job.inspection.inspectorName}
                onChange={(e) => setJob({
                  ...job,
                  inspection: { ...job.inspection, inspectorName: e.target.value }
                })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">TX Mold Assessor License</label>
              <input
                type="text"
                value={job.inspection.inspectorLicense}
                onChange={(e) => setJob({
                  ...job,
                  inspection: { ...job.inspection, inspectorLicense: e.target.value }
                })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Moisture Source Identified</label>
              <select
                value={job.inspection.moistureSource.identified ? 'yes' : 'no'}
                onChange={(e) => setJob({
                  ...job,
                  inspection: {
                    ...job.inspection,
                    moistureSource: {
                      ...job.inspection.moistureSource,
                      identified: e.target.value === 'yes'
                    }
                  }
                })}
                className="input-field"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label">Moisture Source Description</label>
              <textarea
                value={job.inspection.moistureSource.description}
                onChange={(e) => setJob({
                  ...job,
                  inspection: {
                    ...job.inspection,
                    moistureSource: {
                      ...job.inspection.moistureSource,
                      description: e.target.value
                    }
                  }
                })}
                className="input-field"
                rows={3}
              />
            </div>
            <div>
              <label className="label">Visible Mold Present</label>
              <select
                value={job.inspection.visibleMold.present ? 'yes' : 'no'}
                onChange={(e) => setJob({
                  ...job,
                  inspection: {
                    ...job.inspection,
                    visibleMold: {
                      ...job.inspection.visibleMold,
                      present: e.target.value === 'yes'
                    }
                  }
                })}
                className="input-field"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="label">Air Quality Concerns</label>
              <select
                value={job.inspection.airQualityConcerns ? 'yes' : 'no'}
                onChange={(e) => setJob({
                  ...job,
                  inspection: {
                    ...job.inspection,
                    airQualityConcerns: e.target.value === 'yes'
                  }
                })}
                className="input-field"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Performed</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Start Date</label>
                <input
                  type="date"
                  value={job.inspection.workPerformed.startDate.toISOString().split('T')[0]}
                  onChange={(e) => setJob({
                    ...job,
                    inspection: {
                      ...job.inspection,
                      workPerformed: {
                        ...job.inspection.workPerformed,
                        startDate: new Date(e.target.value)
                      }
                    }
                  })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Completion Date</label>
                <input
                  type="date"
                  value={job.inspection.workPerformed.completionDate.toISOString().split('T')[0]}
                  onChange={(e) => setJob({
                    ...job,
                    inspection: {
                      ...job.inspection,
                      workPerformed: {
                        ...job.inspection.workPerformed,
                        completionDate: new Date(e.target.value)
                      }
                    }
                  })}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'containmentSetup', label: 'Containment Setup' },
                    { key: 'negativeAirPressure', label: 'Negative Air' },
                    { key: 'antimicrobialApplied', label: 'Antimicrobial Applied' },
                    { key: 'hepaVacuumed', label: 'HEPA Vacuumed' },
                  ].map(field => (
                    <label key={field.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={job.inspection.workPerformed[field.key as keyof typeof job.inspection.workPerformed] as boolean}
                        onChange={(e) => setJob({
                          ...job,
                          inspection: {
                            ...job.inspection,
                            workPerformed: {
                              ...job.inspection.workPerformed,
                              [field.key]: e.target.checked
                            }
                          }
                        })}
                        className="rounded"
                      />
                      <span className="text-sm">{field.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Moisture Readings Tab */}
      {activeTab === 'moisture' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Moisture Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Room</label>
                <input
                  type="text"
                  value={moistureForm.room}
                  onChange={(e) => setMoistureForm({ ...moistureForm, room: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Surface Material</label>
                <select
                  value={moistureForm.surfaceMaterial}
                  onChange={(e) => setMoistureForm({ ...moistureForm, surfaceMaterial: e.target.value as any })}
                  className="input-field"
                >
                  <option value="drywall">Drywall</option>
                  <option value="concrete">Concrete</option>
                  <option value="wood">Wood</option>
                  <option value="tile">Tile</option>
                  <option value="carpet">Carpet</option>
                </select>
              </div>
              <div>
                <label className="label">Moisture %</label>
                <input
                  type="number"
                  value={moistureForm.moisturePercentage}
                  onChange={(e) => setMoistureForm({ ...moistureForm, moisturePercentage: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  step="0.1"
                />
              </div>
              <div>
                <label className="label">Inspector Initials</label>
                <input
                  type="text"
                  value={moistureForm.inspectorInitials}
                  onChange={(e) => setMoistureForm({ ...moistureForm, inspectorInitials: e.target.value })}
                  className="input-field"
                  maxLength={3}
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                <button onClick={addMoistureReading} className="btn-primary flex items-center w-full">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Reading
                </button>
              </div>
            </div>
          </div>

          {job.inspection.moistureReadings.length > 0 && (
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moisture %</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inspector</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {job.inspection.moistureReadings.map(reading => (
                    <tr key={reading.id}>
                      <td className="px-4 py-3 text-sm">{reading.room}</td>
                      <td className="px-4 py-3 text-sm capitalize">{reading.surfaceMaterial.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-sm">{reading.moisturePercentage}%</td>
                      <td className="px-4 py-3 text-sm">{reading.inspectorInitials}</td>
                      <td className="px-4 py-3 text-sm">{reading.readingDate.toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => removeMoistureReading(reading.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Air Samples Tab */}
      {activeTab === 'air' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Air Sample</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  value={airSampleForm.location}
                  onChange={(e) => setAirSampleForm({ ...airSampleForm, location: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Sample Type</label>
                <select
                  value={airSampleForm.sampleType}
                  onChange={(e) => setAirSampleForm({ ...airSampleForm, sampleType: e.target.value as any })}
                  className="input-field"
                >
                  <option value="spore_trap">Spore Trap</option>
                  <option value="swab">Swab</option>
                  <option value="bulk">Bulk</option>
                </select>
              </div>
              <div>
                <label className="label">Lab Name</label>
                <input
                  type="text"
                  value={airSampleForm.labName}
                  onChange={(e) => setAirSampleForm({ ...airSampleForm, labName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Colonies/m³</label>
                <input
                  type="number"
                  value={airSampleForm.coloniesPerM3}
                  onChange={(e) => setAirSampleForm({ ...airSampleForm, coloniesPerM3: parseInt(e.target.value) || 0 })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={airSampleForm.exceedsOutdoorControl}
                    onChange={(e) => setAirSampleForm({ ...airSampleForm, exceedsOutdoorControl: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Exceeds Outdoor Control</span>
                </label>
              </div>
              <div className="flex items-end">
                <button onClick={addAirSample} className="btn-primary flex items-center w-full">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Sample
                </button>
              </div>
            </div>
          </div>

          {job.inspection.airSamples.length > 0 && (
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lab</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Colonies/m³</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exceeds Control</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {job.inspection.airSamples.map(sample => (
                    <tr key={sample.id}>
                      <td className="px-4 py-3 text-sm">{sample.location}</td>
                      <td className="px-4 py-3 text-sm capitalize">{sample.sampleType.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-sm">{sample.labName}</td>
                      <td className="px-4 py-3 text-sm">{sample.coloniesPerM3}</td>
                      <td className="px-4 py-3 text-sm">{sample.exceedsOutdoorControl ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => removeAirSample(sample.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Photos</h3>
              <label className="btn-primary flex items-center cursor-pointer">
                <Camera className="h-5 w-5 mr-2" />
                Add Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {job.inspection.photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {job.inspection.photos.map(photo => (
                <div key={photo.id} className="card p-3">
                  <img
                    src={photo.url}
                    alt={photo.filename}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <p className="text-xs text-gray-600 truncate">{photo.filename}</p>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="text-red-600 hover:text-red-800 text-xs mt-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No photos uploaded yet</p>
            </div>
          )}
        </div>
      )}

      {/* Generated PDFs Tab */}
      {activeTab === 'pdfs' && (
        <div className="space-y-6">
          {generatedPdfs.length > 0 ? (
            generatedPdfs.map((result, idx) => (
              <PdfResultCard
                key={idx}
                result={result}
                adjusterEmail={job.insurance.adjuster.email}
                jobId={job.id}
              />
            ))
          ) : (
            <div className="card text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No PDFs Generated Yet</h3>
              <p className="text-gray-600 mb-4">Click the button above to generate insurance documents</p>
            </div>
          )}
        </div>
      )}

      {showTemplateModal && (
        <TemplateSelectionModal
          templates={templates}
          onClose={() => setShowTemplateModal(false)}
          onGenerate={handleGeneratePdfs}
        />
      )}
    </div>
  );
};

export default JobDetail;