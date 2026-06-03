import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API = axios.create({ baseURL });

export const getGuides = () => API.get('/guides');
export const getGuide = (id) => API.get(`/guides/${id}`);
export const createGuide = (data) => API.post('/guides', data);
export const updateGuide = (id, data) => API.put(`/guides/${id}`, data);
export const deleteGuide = (id) => API.delete(`/guides/${id}`);
export const bulkCreateGuides = (data) => API.post('/guides/bulk', data);

export const getStudents = () => API.get('/students');
export const getStudent = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const bulkCreateStudents = (data) => API.post('/students/bulk', data);

export const getProjects = (params) => API.get('/projects', { params });
export const getProjectStats = () => API.get('/projects/stats');
export const getProject = (id) => API.get(`/projects/${id}`);
export const createProject = (formData) =>
    API.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProject = (id, formData) =>
    API.put(`/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProject = (id) => API.delete(`/projects/${id}`);

export const notifyGuide = (projectId) => API.post(`/whatsapp/notify/${projectId}`);
export const sendCustomWhatsApp = (data) => API.post('/whatsapp/custom', data);

export default API;
