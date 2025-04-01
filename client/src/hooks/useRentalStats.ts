import { useQuery } from '@tanstack/react-query';
import { getRentalViewStats, getRentalStatusStats } from '../services/rentalService';
import { RentalViewStats, RentalStatusStats } from '../types/rental';

export const useRentalViewStats = () => {
    return useQuery<RentalViewStats[]>({
        queryKey: ['rentalViewStats'],
        queryFn: getRentalViewStats,
        staleTime: 5 * 60 * 1000,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

export const useRentalStatusStats = () => {
    return useQuery<RentalStatusStats>({
        queryKey: ['rentalStatusStats'],
        queryFn: getRentalStatusStats,
        staleTime: 5 * 60 * 1000,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};