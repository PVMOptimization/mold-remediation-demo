import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Job, Customer, Property, LossInfo, InsuranceInfo } from '../types'; // removed unused InspectionData
import { generateJobId } from '../utils/jobHelpers';
import { Save, ArrowLeft } from 'lucide-react'; // icons used in this file


const NewJob: React.FC = () => {
  const navigate = useNavigate();
  const { addJob } = useApp();

  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: '',
    email: '',
    isPolicyHolder: true,
  });

  const [property, setProperty] = useState<Property>({
    street: '',
    city: '',
    state: 'TX',
    zip: '',
    propertyType: 'residential',
    squareFootage: 0,
  });

  const [lossInfo, setLossInfo] = useState<LossInfo>({
    lossDate: new Date(),
    lossType: 'water_damage',
    lossDescription: '',
    affectedSquareFootage: 0,
    affectedRooms: [],
  });

  const [insurance, setInsurance] = useState<InsuranceInfo>({
    carrier: '',
    policyNumber: '',
    claimNumber: '',
    adjuster: {
      name: '',
      phone: '',
      email: '',
    },
  });

  const [roomInput, setRoomInput] = useState('');

  const addRoom = () => {
    if (roomInput.trim()) {
      setLossInfo(prev => ({
        ...prev,
        affectedRooms: [...prev.affectedRooms, roomInput.trim()],
      }));
      setRoomInput('');
    }
  };

  const removeRoom = (index: number) => {
    setLossInfo(prev => ({
      ...prev,
      affectedRooms: prev.affectedRooms.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newJob: Job = {
      id: generateJobId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      customer,
      property,
      lossInfo,
      insurance,
      inspection: {
        inspectionDate: new Date(),
        inspectorName: '',
        inspectorLicense: '',
        moistureSource: { identified: false, description: '' },
        visibleMold: { present: false, locations: [] },
        airQualityConcerns: false,
        moistureReadings: [],
        airSamples: [],
        photos: [],
        workPerformed: {
          containmentSetup: false,
          negativeAirPressure: false,
          contaminatedMaterialsRemoved: [],
          surfacesCleaned: [],
          antimicrobialApplied: false,
          hepaVacuumed: false,
          dehumidificationDays: 0,
          startDate: new Date(),
          completionDate: new Date(),
        },
        equipmentUsed: [],
      },
      files: [],
    };

    addJob(newJob);
    navigate(`/jobs/${newJob.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>
      </div>

      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Job</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Phone *</label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="input-field"
                  placeholder="(555) 555-5555"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Email</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Street Address *</label>
                <input
                  type="text"
                  required
                  value={property.street}
                  onChange={(e) => setProperty({ ...property, street: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">City *</label>
                <input
                  type="text"
                  required
                  value={property.city}
                  onChange={(e) => setProperty({ ...property, city: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">ZIP Code *</label>
                <input
                  type="text"
                  required
                  value={property.zip}
                  onChange={(e) => setProperty({ ...property, zip: e.target.value })}
                  className="input-field"
                  placeholder="75001"
                />
              </div>
              <div>
                <label className="label">Property Type *</label>
                <select
                  value={property.propertyType}
                  onChange={(e) => setProperty({ ...property, propertyType: e.target.value as 'residential' | 'commercial' })}
                  className="input-field"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="label">Total Square Footage *</label>
                <input
                  type="number"
                  required
                  value={property.squareFootage || ''}
                  onChange={(e) => setProperty({ ...property, squareFootage: parseInt(e.target.value) || 0 })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Loss Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Loss Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Loss Date *</label>
                <input
                  type="date"
                  required
                  value={lossInfo.lossDate.toISOString().split('T')[0]}
                  onChange={(e) => setLossInfo({ ...lossInfo, lossDate: new Date(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Loss Type *</label>
                <select
                  value={lossInfo.lossType}
                  onChange={(e) => setLossInfo({ ...lossInfo, lossType: e.target.value as any })}
                  className="input-field"
                >
                  <option value="water_damage">Water Damage</option>
                  <option value="flood">Flood</option>
                  <option value="pipe_burst">Pipe Burst</option>
                  <option value="roof_leak">Roof Leak</option>
                  <option value="hvac_leak">HVAC Leak</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Loss Description *</label>
                <textarea
                  required
                  value={lossInfo.lossDescription}
                  onChange={(e) => setLossInfo({ ...lossInfo, lossDescription: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Describe the damage and how it occurred..."
                />
              </div>
              <div>
                <label className="label">Affected Square Footage *</label>
                <input
                  type="number"
                  required
                  value={lossInfo.affectedSquareFootage || ''}
                  onChange={(e) => setLossInfo({ ...lossInfo, affectedSquareFootage: parseInt(e.target.value) || 0 })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Add Affected Rooms</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={roomInput}
                    onChange={(e) => setRoomInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRoom())}
                    className="input-field"
                    placeholder="e.g., Master Bedroom"
                  />
                  <button
                    type="button"
                    onClick={addRoom}
                    className="btn-secondary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {lossInfo.affectedRooms.map((room, idx) => (
                    <span
                      key={idx}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {room}
                      <button
                        type="button"
                        onClick={() => removeRoom(idx)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Insurance Carrier *</label>
                <input
                  type="text"
                  required
                  value={insurance.carrier}
                  onChange={(e) => setInsurance({ ...insurance, carrier: e.target.value })}
                  className="input-field"
                  placeholder="e.g., State Farm"
                />
              </div>
              <div>
                <label className="label">Policy Number *</label>
                <input
                  type="text"
                  required
                  value={insurance.policyNumber}
                  onChange={(e) => setInsurance({ ...insurance, policyNumber: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Claim Number *</label>
                <input
                  type="text"
                  required
                  value={insurance.claimNumber}
                  onChange={(e) => setInsurance({ ...insurance, claimNumber: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Adjuster Name</label>
                <input
                  type="text"
                  value={insurance.adjuster.name}
                  onChange={(e) => setInsurance({
                    ...insurance,
                    adjuster: { ...insurance.adjuster, name: e.target.value }
                  })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Adjuster Phone</label>
                <input
                  type="tel"
                  value={insurance.adjuster.phone}
                  onChange={(e) => setInsurance({
                    ...insurance,
                    adjuster: { ...insurance.adjuster, phone: e.target.value }
                  })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Adjuster Email</label>
                <input
                  type="email"
                  value={insurance.adjuster.email}
                  onChange={(e) => setInsurance({
                    ...insurance,
                    adjuster: { ...insurance.adjuster, email: e.target.value }
                  })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center">
              <Save className="h-5 w-5 mr-2" />
              Create Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewJob;