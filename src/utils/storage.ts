import type { Job } from '../types';

const JOBS_KEY = 'mold_remediation_jobs';

export const saveJobToStorage = (job: Job): void => {
  const jobs = getJobsFromStorage();
  const existingIndex = jobs.findIndex(j => j.id === job.id);
  
  if (existingIndex >= 0) {
    jobs[existingIndex] = job;
  } else {
    jobs.push(job);
  }
  
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
};

export const getJobsFromStorage = (): Job[] => {
  const stored = localStorage.getItem(JOBS_KEY);
  if (!stored) return [];
  
  const jobs = JSON.parse(stored);
  
  return jobs.map((job: any) => ({
    ...job,
    createdAt: new Date(job.createdAt),
    updatedAt: new Date(job.updatedAt),
    lossInfo: {
      ...job.lossInfo,
      lossDate: new Date(job.lossInfo.lossDate),
    },
    inspection: {
      ...job.inspection,
      inspectionDate: new Date(job.inspection.inspectionDate),
      moistureReadings: job.inspection.moistureReadings.map((mr: any) => ({
        ...mr,
        readingDate: new Date(mr.readingDate),
      })),
      airSamples: job.inspection.airSamples.map((as: any) => ({
        ...as,
        sampleDate: new Date(as.sampleDate),
      })),
      photos: job.inspection.photos.map((p: any) => ({
        ...p,
        capturedAt: new Date(p.capturedAt),
      })),
      workPerformed: {
        ...job.inspection.workPerformed,
        startDate: new Date(job.inspection.workPerformed.startDate),
        completionDate: new Date(job.inspection.workPerformed.completionDate),
      },
    },
    files: job.files.map((f: any) => ({
      ...f,
      uploadedAt: new Date(f.uploadedAt),
    })),
  }));
};

export const getJobById = (id: string): Job | null => {
  const jobs = getJobsFromStorage();
  return jobs.find(j => j.id === id) || null;
};

export const deleteJob = (id: string): void => {
  const jobs = getJobsFromStorage();
  const filtered = jobs.filter(j => j.id !== id);
  localStorage.setItem(JOBS_KEY, JSON.stringify(filtered));
};