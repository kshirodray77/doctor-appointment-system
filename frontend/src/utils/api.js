import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Doctors
export const getDoctors = (params) => API.get('/doctors', { params });
export const getDoctorById = (id) => API.get(`/doctors/${id}`);
export const getDoctorSlots = (id) => API.get(`/doctors/${id}/slots`);
export const addSlots = (slots) => API.post('/doctors/slots', { slots });

// Appointments
export const bookAppointment = (data) => API.post('/appointments', data);
export const getMyAppointments = () => API.get('/appointments/my');
export const getDoctorAppointments = () => API.get('/appointments/doctor');
export const cancelAppointment = (id) => API.put(`/appointments/${id}/cancel`);
export const completeAppointment = (id, notes) =>
  API.put(`/appointments/${id}/complete`, { notes });

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAllAppointments = () => API.get('/admin/appointments');
export const getAllDoctors = () => API.get('/admin/doctors');
