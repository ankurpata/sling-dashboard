import {apiEndpoints} from '../config/api';

// Create a new project
export async function createProject(repository) {
  try {
    const response = await fetch(apiEndpoints.project.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: repository.userId?.toString(),
        repoId: repository.repoId?.toString(),
        orgId: repository.orgId?.toString(),
        name: repository.name,
        repository: {
          name: repository.name,
          fullName: repository.full_name,
          private: repository.private,
          htmlUrl: repository.html_url,
          language: repository.language,
          defaultBranch: repository.default_branch,
          organization: repository.owner?.login,
          orgId: repository.owner?.id?.toString(),
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Get all projects for current user
export async function getProjects() {
  try {
    const userId = localStorage.getItem('userId');
    const response = await fetch(
      `${apiEndpoints.project.base}?userId=${userId}`,
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch projects');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

// Get a specific project
export async function getProject(projectId) {
  try {
    const response = await fetch(
      `${apiEndpoints.project.detail}?_id=${projectId}`,
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

// Update a project
export async function updateProject(projectId, updates) {
  try {
    const response = await fetch(
      `${apiEndpoints.project.base}?_id=${projectId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Delete a project
export async function deleteProject(projectId) {
  try {
    const response = await fetch(
      `${apiEndpoints.project.base}?_id=${projectId}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Keep existing functions unchanged
export async function detectFramework(repoUrl) {
  try {
    const response = await fetch(apiEndpoints.project.detect, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({repoUrl}),
    });

    if (!response.ok) {
      throw new Error('Failed to detect framework');
    }

    return await response.json();
  } catch (error) {
    console.error('Error detecting framework:', error);
    throw error;
  }
}

export async function deployProject(projectId, deploymentData) {
  try {
    const response = await fetch(
      `${apiEndpoints.project.deploy}/${projectId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deploymentData),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to deploy project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deploying project:', error);
    throw error;
  }
}

export async function getDeploymentStatus(projectId, deploymentId) {
  try {
    const response = await fetch(
      `${apiEndpoints.project.deploy}/${projectId}/status/${deploymentId}`,
    );

    if (!response.ok) {
      throw new Error('Failed to get deployment status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting deployment status:', error);
    throw error;
  }
}

export async function updateBuildSettings(projectId, settings) {
  try {
    const response = await fetch(
      `${apiEndpoints.project.buildSettings}/${projectId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to update build settings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating build settings:', error);
    throw error;
  }
}

export async function updateEnvironmentVariables(projectId, variables) {
  try {
    const response = await fetch(`${apiEndpoints.project.env}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({environmentVariables: variables, projectId}),
    });

    if (!response.ok) {
      throw new Error('Failed to update environment variables');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating environment variables:', error);
    throw error;
  }
}
