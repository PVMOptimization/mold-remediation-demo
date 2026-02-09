import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Job, PdfTemplate, UserRole } from '../types';
import { getJobsFromStorage, saveJobToStorage } from '../utils/storage';
import { pdfTemplates } from '../data/templates';

interface AppContextType {
  currentUser: { role: UserRole; name: string };
  jobs: Job[];
  templates: PdfTemplate[];
  activeJobId: string | null;
  setCurrentUser: (user: { role: UserRole; name: string }) => void;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  setActiveJobId: (id: string | null) => void;
  getActiveJob: () => Job | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<{ role: UserRole; name: string }>({
    role: 'inspector',
    name: 'Demo User',
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [templates] = useState<PdfTemplate[]>(pdfTemplates);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  useEffect(() => {
    const loadedJobs = getJobsFromStorage();
    setJobs(loadedJobs);
  }, []);

  const addJob = (job: Job) => {
    setJobs(prev => [...prev, job]);
    saveJobToStorage(job);
  };

  const updateJob = (job: Job) => {
    setJobs(prev => prev.map(j => j.id === job.id ? job : j));
    saveJobToStorage(job);
  };

  const getActiveJob = () => {
    if (!activeJobId) return null;
    return jobs.find(j => j.id === activeJobId) || null;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        jobs,
        templates,
        activeJobId,
        setCurrentUser,
        addJob,
        updateJob,
        setActiveJobId,
        getActiveJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};