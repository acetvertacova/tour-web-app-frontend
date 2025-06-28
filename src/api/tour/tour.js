import api from '../api';

export const getTours = async () => {
    const response = await api.get('/tours');
    return response.data;
};

export const getTourById = async (id) => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
};

export const createTour = async (tour) => {
    const response = await api.post('/tours', tour);
    return response.data;
};

export const updateTour = async (id, tour) => {
    const response = await api.put(`/tours/${id}`, tour);
    return response.data;
};

export const filterToursByMultiParam = async (params) => {
    const response = await api.get('/tours/search', { params });
    return response.data;
};

export const deleteTour = async (id) => {
    await api.delete(`/tours/${id}`);
};

// export const filterByCountry = async (country) => {
//     const response = await api.get(`/tours/country/${country}`);
//     return response.data;
// }