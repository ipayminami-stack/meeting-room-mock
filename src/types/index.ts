export type Role = 'applicant' | 'approver' | 'admin' | 'observer';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface User {
    id: string;
    name: string;
    role: Role;
    department?: string;
    avatar?: string;
}

export interface Room {
    id: string;
    name: string;
    capacity: number;
    facilities: string[]; // e.g., ['Projector', 'Whiteboard']
    floor?: string;
}

export interface Reservation {
    id: string;
    roomId: string;
    userId: string;
    userName: string; // Denormalized for simpler display
    startTime: string; // ISO string
    endTime: string;   // ISO string
    purpose: string;
    participants: number;
    status: RequestStatus;
    createdAt: string;
    rejectionReason?: string;
    qrCode?: string; // Mock string for QR
    externalVisitors?: {
        company: string;
        name: string;
        email: string;
    }[];
}

// For form submission
export interface CreateReservationInput {
    roomId: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    purpose: string;
    participants: number;
}
