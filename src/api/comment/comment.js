import api from '../api';

export const getCommentsByTourId = async (tourId) => {
    const response = await api.get(`/comments/${tourId}`);
    return response.data;
};

export const createComment = async (data) => {
    const response = await api.post('/comments', data);
    return response.data;
};

export const updateComment = async (id, data) => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
};

export const deleteComment = async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
};