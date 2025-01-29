import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProject } from '../services/projectService';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load project from localStorage on mount
  useEffect(() => {
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject) {
      try {
        setCurrentProject(JSON.parse(savedProject));
      } catch (error) {
        console.error('Error loading saved project:', error);
      }
    }
  }, []);

  const setProject = (project) => {
    setCurrentProject(project);
    if (project) {
      localStorage.setItem('currentProject', JSON.stringify(project));
    } else {
      localStorage.removeItem('currentProject');
    }
  };

  const loadProjectById = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const project = await getProject(projectId);
      setProject(project);
    } catch (err) {
      setError(err.message);
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearProject = () => {
    setCurrentProject(null);
    localStorage.removeItem('currentProject');
  };

  return (
    <ProjectContext.Provider value={{ 
      currentProject, 
      setProject, 
      clearProject, 
      loadProjectById,
      loading,
      error 
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
