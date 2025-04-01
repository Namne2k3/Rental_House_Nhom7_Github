export interface AppointmentDTO {
    id: number;
    nhaTroId: number;
    userId: number;
    ownerId: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    title: string;
    status: string;
    createAt: string;
    updatedAt: string;
}

export interface AppointmentFilter {
    ownerId?: number;
    userId?: number;
    customerName?: string;
    date?: Date;
    status?: string;
}

export interface AppointmentStatsDto {
    totalAppointments: number;
    completedAppointments: number;
    pendingAppointments: number;
    cancelledAppointments: number;
}

export interface AppointmentTimeStatsDto {
    timeSlot: string;
    count: number;
}

export interface AppointmentDetail {
    id: number;
    nhaTroTitle: string;
    userName: string;
    ownerName: string;
    appointmentTime: string;
    status: string;
    createdAt: string;
    completedAt: string | null;
    notes: string | null;
}

export interface AppointmentHistoryDto {
    id: number;
    status: string;
    notes: string;
    changedBy: string;
    createdAt: string;
}