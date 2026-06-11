import { api } from '../api';

const LiderApi = {
    getAll: () => api.get('/lider/'),
    getById: (id) => api.get(`/lider/${id}`),
    create: (data) => api.post('/lider/', data),
    update: (id, data) => api.put(`/lider/${id}`, data),
    delete: (id) => api.delete(`/lider/${id}`),
};

export default LiderApi;
