import { RentalStatusStats, RentalViewStats } from '../types/rental';
import api from './api';

export const getRentalViewStats = async (): Promise<RentalViewStats[]> => {
    const response = await api.get('/NhaTro/view-stats');
    return response.data;
};

export const getRentalStatusStats = async (): Promise<RentalStatusStats> => {
    const response = await api.get('/NhaTro/status-stats');
    return response.data;
}; 