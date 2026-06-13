import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API = axios.create({ baseURL });

export const getGuides = () => API.get('/guides');
export const getGuide = (id) => API.get(`/guides/${id}`);
export const createGuide = (data) => API.post('/guides', data);
export const updateGuide = (id, data) => API.put(`/guides/${id}`, data);
export const deleteGuide = (id) => API.delete(`/guides/${id}`);
export const bulkCreateGuides = (data) => API.post('/guides/bulk', data);

export const getGroups = () => API.get('/groups');
export const getGroup = (id) => API.get(`/groups/${id}`);
export const createGroup = (data) => API.post('/groups', data);
export const updateGroup = (id, data) => API.put(`/groups/${id}`, data);
export const deleteGroup = (id) => API.delete(`/groups/${id}`);
export const bulkCreateGroups = (data) => API.post('/groups/bulk', data);

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
