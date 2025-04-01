import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { AppointmentDTO, AppointmentFilter, AppointmentStatsDto, AppointmentTimeStatsDto } from "../types/appointment";

export interface CreateAppointmentDto {
    nhaTroId: number;
    ownerId: number;
    appointmentTime: string;
    notes?: string;
}

export interface UpdateAppointmentStatusDto {
    appointmentId: number;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    notes?: string;
}

export const fetchAppointmentsUser = async (filters: AppointmentFilter): Promise<AppointmentDTO[]> => {
    const response = await api.get(`/Appointment/User/${filters.userId}`);

    return response.data;
};

export const fetchAppointmentsCustomer = async (filters: AppointmentFilter): Promise<AppointmentDTO[]> => {
    const response = await api.get(`/Appointment/Owner/${filters.ownerId}`, {
        params: filters
    });

    return response.data;
};

const fetchAppointmentStats = async (userId: number) => {
    const response = await api.get<AppointmentStatsDto>("/Appointment/stats", {
        params: { userId }
    });
    return response.data;
};

const fetchPopularAppointmentTimes = async () => {
    const response = await api.get<AppointmentTimeStatsDto[]>("/Appointment/popular-times");
    return response.data;
};

export const useAppointmentsUser = (filters: AppointmentFilter = {}) => {
    return useQuery({
        queryKey: ['appointmentsUser', filters],
        queryFn: () => fetchAppointmentsUser(filters),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        gcTime: 1000 * 60 * 5
    });
};

export const useAppointmentsCustomer = (filters: AppointmentFilter = {}) => {
    return useQuery({
        queryKey: ['appointmentsCustomer', filters],
        queryFn: () => fetchAppointmentsCustomer(filters),
        staleTime: Infinity,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        gcTime: 1000 * 60 * 5
    });
};

export const useAppointmentStats = (userId: number) => {
    return useQuery<AppointmentStatsDto>({
        queryKey: ['appointmentStats', userId],
        queryFn: () => fetchAppointmentStats(userId),
        staleTime: 5 * 60 * 1000,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

export const useAppointmentTimeStats = () => {
    return useQuery<AppointmentTimeStatsDto[]>({
        queryKey: ['appointmentTimeStats'],
        queryFn: fetchPopularAppointmentTimes,
        staleTime: 5 * 60 * 1000,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

export const useAppointments = (filter: AppointmentFilter) => {
    return useQuery({
        queryKey: ['appointments', filter],
        queryFn: async () => {
            const response = await api.get('/Appointments', { params: filter });
            return response.data;
        }
    });
};


export const useCreateAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateAppointmentDto) => {
            const response = await api.post('/Appointments', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['appointmentStats'] });
        }
    });
};

export const useUpdateAppointmentStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateAppointmentStatusDto) => {
            const response = await api.put(`/Appointments/${data.appointmentId}/status`, {
                status: data.status,
                notes: data.notes
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['appointmentStats'] });
        }
    });
};