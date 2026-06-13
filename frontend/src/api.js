import axios from 'axios';

const LOCAL_API_URL = 'http://localhost:5000/api';
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const fallbackApiUrl = import.meta.env.DEV ? LOCAL_API_URL : '/api';
const baseURL = (configuredApiUrl || fallbackApiUrl).replace(/\/$/, '');

export const apiBaseURL = baseURL;
export const apiOrigin = (() => {
    try {
        return new URL(baseURL, window.location.origin).origin;
    } catch {
        return '';
    }
})();

export const getAssetUrl = (path) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${apiOrigin}${normalizedPath}`;
};

export const formatApiError = (err, fallback = 'Request failed.') => {
    const data = err?.response?.data;

    if (data?.details?.length) {
        return `${data.error || fallback}: ${data.details.join('; ')}`;
    }

    if (data?.error) return data.error;

    if (!configuredApiUrl && import.meta.env.PROD && err?.response?.status === 404) {
        return 'Backend API was not found at /api. Set VITE_API_URL to the deployed backend URL and redeploy the frontend.';
    }

    if (!err?.response && err?.message === 'Network Error') {
        return `Cannot reach the backend API at ${baseURL}. Start the backend server, or set VITE_API_URL to the deployed backend URL.`;
    }

    if (err?.code === 'ECONNABORTED') {
        return 'The request timed out. Please check the backend server and try again.';
    }

    return err?.message || fallback;
};

const API = axios.create({ baseURL, timeout: 15000 });

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
export const clearAllGroups = () => API.delete('/groups/all/clear');

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
