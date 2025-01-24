import { apiEndpoints } from '../config/api';

const projectService = {
  async createProject(projectData) {
    try {
      const response = await fetch(apiEndpoints.project.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...projectData,
          userId: localStorage.getItem('userId'),
          organizationId: JSON.parse(localStorage.getItem('selectedOrg'))?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async detectFramework(repoUrl) {
    try {
      const response = await fetch(apiEndpoints.project.detect, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to detect framework');
      }

      return await response.json();
    } catch (error) {
      console.error('Error detecting framework:', error);
      throw error;
    }
  },

  async deployProject(projectId, deploymentData) {
    try {
      const response = await fetch(`${apiEndpoints.project.deploy}/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deploymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to deploy project');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deploying project:', error);
      throw error;
    }
  },

  async getDeploymentStatus(projectId, deploymentId) {
    try {
      const response = await fetch(
        `${apiEndpoints.project.deploy}/${projectId}/status/${deploymentId}`
      );

      if (!response.ok) {
        throw new Error('Failed to get deployment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting deployment status:', error);
      throw error;
    }
  },

  async updateBuildSettings(projectId, settings) {
    try {
      const response = await fetch(
        `${apiEndpoints.project.buildSettings}/${projectId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update build settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating build settings:', error);
      throw error;
    }
  },

  async updateEnvironmentVariables(projectId, variables) {
    try {
      const response = await fetch(`${apiEndpoints.project.env}/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ variables }),
      });

      if (!response.ok) {
        throw new Error('Failed to update environment variables');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating environment variables:', error);
      throw error;
    }
  },
};

export default projectService;
