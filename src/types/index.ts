export interface Job {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'ready' | 'submitted' | 'approved';
  customer: Customer;
  property: Property;
  lossInfo: LossInfo;
  inspection: InspectionData;
  insurance: InsuranceInfo;
  files: JobFile[];
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
  isPolicyHolder: boolean;
}

export interface Property {
  street: string;
  city: string;
  state: string;
  zip: string;
  propertyType: 'residential' | 'commercial';
  squareFootage: number;
}

export interface LossInfo {
  lossDate: Date;
  lossType: 'water_damage' | 'flood' | 'pipe_burst' | 'roof_leak' | 'hvac_leak' | 'other';
  lossDescription: string;
  affectedSquareFootage: number;
  affectedRooms: string[];
}

export interface InspectionData {
  inspectionDate: Date;
  inspectorName: string;
  inspectorLicense: string;
  moistureSource: {
    identified: boolean;
    description: string;
  };
  visibleMold: {
    present: boolean;
    locations: string[];
  };
  airQualityConcerns: boolean;
  moistureReadings: MoistureReading[];
  airSamples: AirSample[];
  photos: Photo[];
  workPerformed: WorkPerformed;
  equipmentUsed: Equipment[];
}

export interface MoistureReading {
  id: string;
  room: string;
  surfaceMaterial: 'drywall' | 'concrete' | 'wood' | 'tile' | 'carpet';
  moisturePercentage: number;
  readingDate: Date;
  inspectorInitials: string;
  notes?: string;
}

export interface AirSample {
  id: string;
  location: string;
  sampleType: 'spore_trap' | 'swab' | 'bulk';
  labName: string;
  sampleDate: Date;
  resultsReceived: boolean;
  coloniesPerM3?: number;
  moldTypesDetected?: string[];
  exceedsOutdoorControl: boolean;
}

export interface Photo {
  id: string;
  filename: string;
  url: string;
  category: 'before' | 'during' | 'after' | 'damage' | 'equipment';
  capturedAt: Date;
  caption?: string;
  room?: string;
}

export interface WorkPerformed {
  containmentSetup: boolean;
  negativeAirPressure: boolean;
  contaminatedMaterialsRemoved: string[];
  surfacesCleaned: string[];
  antimicrobialApplied: boolean;
  hepaVacuumed: boolean;
  dehumidificationDays: number;
  startDate: Date;
  completionDate: Date;
}

export interface Equipment {
  type: 'dehumidifier' | 'air_scrubber' | 'hepa_vacuum' | 'moisture_meter' | 'other';
  quantity: number;
  daysUsed: number;
}

export interface InsuranceInfo {
  carrier: string;
  policyNumber: string;
  claimNumber: string;
  adjuster: Adjuster;
}

export interface Adjuster {
  name: string;
  phone: string;
  email: string;
  company?: string;
}

export interface JobFile {
  id: string;
  filename: string;
  type: 'photo' | 'moisture_data' | 'air_sample_data' | 'pdf' | 'other';
  url: string;
  size: number;
  uploadedAt: Date;
}

export interface PdfTemplate {
  id: string;
  name: string;
  description: string;
  category: 'claim_form' | 'work_order' | 'certificate' | 'estimate';
  fields: PdfField[];
  requiredFields: string[];
  previewUrl?: string;
}

export interface PdfField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'checkbox' | 'signature' | 'photo';
  dataPath: string;
  required: boolean;
  maxLength?: number;
  format?: string;
}

export interface PdfGenerationResult {
  templateId: string;
  templateName: string;
  pdfUrl: string;
  fieldsPopulated: number;
  totalFields: number;
  missingFields: string[];
  warnings: string[];
  generatedAt: Date;
}

export interface AppState {
  currentUser: {
    role: 'inspector' | 'admin' | 'owner';
    name: string;
  };
  jobs: Job[];
  templates: PdfTemplate[];
  activeJobId: string | null;
}

export type UserRole = 'inspector' | 'admin' | 'owner';