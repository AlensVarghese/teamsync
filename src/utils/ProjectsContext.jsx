// Assuming useProjects is implemented in a context file
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectsContext = React.createContext();

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  // Fetch projects when the component is mounted
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const updateProject = (projectId, updatedProject) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project._id === projectId ? { ...project, ...updatedProject } : project
      )
    );
  };
  const archiveProject = async (projectId) => {
    try {
      await axios.patch(`http://localhost:5000/api/projects/${projectId}/archive`);
      setProjects(prevProjects => 
        prevProjects.map(project =>
          project._id === projectId ? { ...project, archived: !project.archived } : project
        )
      );
    } catch (error) {
      console.error('Error archiving project:', error);
    }
  };
  
  // Delete a project
  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
      setProjects(prevProjects => 
        prevProjects.filter(project => project._id !== projectId)
      );
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <ProjectsContext.Provider
      value={{ projects, setProjects, updateProject, deleteProject, archiveProject }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => React.useContext(ProjectsContext);
