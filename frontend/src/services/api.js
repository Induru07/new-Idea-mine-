import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

export const tripService = {
  getAllTrips: async (filters = {}) => {
    const response = await api.get('/trips', { params: filters });
    return response.data;
  },
  getTrip: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },
  createTrip: async (tripData) => {
    const formData = new FormData();
    Object.keys(tripData).forEach(key => {
      if (key === 'photos') {
        tripData[key].forEach(photo => {
          formData.append('photos', photo);
        });
      } else {
        formData.append(key, tripData[key]);
      }
    });
    const response = await api.post('/trips', formData);
    return response.data;
  },
  updateTrip: async (id, tripData) => {
    const formData = new FormData();
    Object.keys(tripData).forEach(key => {
      if (key === 'photos' && Array.isArray(tripData[key])) {
        tripData[key].forEach(photo => {
          if (photo instanceof File) {
            formData.append('photos', photo);
          }
        });
      } else {
        formData.append(key, tripData[key]);
      }
    });
    const response = await api.put(`/trips/${id}`, formData);
    return response.data;
  },
  deleteTrip: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },
};
