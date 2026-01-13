import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Update with your backend URL

// Function to add a new task

export const addTask = async (newTask) => {
  console.log("Adding task:", newTask); // Log the task being added
  try {
    const response = await axios.post(`${API_URL}/tasks`, newTask);
    console.log("Task added successfully:", response.data); // Log the response
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// Function to update an existing task
export const updateTask = async (taskId, updatedTask) => {
  console.log("Updating task ID:", taskId, "with data:", updatedTask);
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, updatedTask);
    console.log("Task updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Function to delete a task
export const deleteTask = async (taskId, projectId) => {
  console.log("Deleting task ID:", taskId, "from project ID:", projectId);
  try {
    await axios.delete(`${API_URL}/tasks/${taskId}/${projectId}`);
    console.log("Task deleted successfully");
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Function to get tasks for a user
export const getUserTasks = async (email) => {
  console.log("Fetching tasks for email:", email);
  try {
    const response = await axios.get(`${API_URL}/tasks`, { params: { email } });
    console.log("Tasks fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};
