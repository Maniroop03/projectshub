import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const fallbackApiUrl = import.meta.env.DEV ? '/api' : '/api';
const baseURL = (configuredApiUrl || fallbackApiUrl).replace(/\/$/, '');
const missingApiMessage = 'Backend API is not connected. Set VITE_API_URL to the deployed backend URL and redeploy the frontend.';

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
    if (err?.isApiConfigError) return err.message;

    const data = err?.response?.data;

    if (data?.details?.length) {
        return `${data.error || fallback}: ${data.details.join('; ')}`;
    }

    if (data?.error) return data.error;

    if (!configuredApiUrl && import.meta.env.PROD && err?.response?.status === 404) {
        return missingApiMessage;
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

// Attach admin secret header if available (from env or stored by login)
const adminSecret = () => {
    try {
        return localStorage.getItem('admin_secret') || import.meta.env.VITE_ADMIN_SECRET || '';
    } catch {
        return import.meta.env.VITE_ADMIN_SECRET || '';
    }
};

API.interceptors.request.use((config) => {
    const secret = adminSecret();
    if (secret) config.headers['x-admin-secret'] = secret;
    return config;
});

API.interceptors.response.use((response) => {
    const contentType = response.headers?.['content-type'] || '';
    const isHtmlResponse =
        contentType.includes('text/html') ||
        (typeof response.data === 'string' && /^\s*(<!doctype html|<html[\s>])/i.test(response.data));

    if (isHtmlResponse) {
        const err = new Error(!configuredApiUrl && import.meta.env.PROD
            ? missingApiMessage
            : 'Backend API returned HTML instead of JSON. Please check the API URL.');
        err.response = response;
        err.isApiConfigError = true;
        throw err;
    }

    return response;
});

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
export const groupLogin = (data) => API.post('/groups/login', data);

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
