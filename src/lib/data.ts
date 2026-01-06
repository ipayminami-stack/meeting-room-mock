import { Room, User, Reservation } from '@/types';

export const MOCK_USERS: User[] = [
    { id: '1', name: '叶会 太郎', role: 'applicant', department: 'CoE推進部' },
    { id: '2', name: '吉田 課長', role: 'approver', department: 'CoE推進部' },
    { id: '3', name: '中山 監査役', role: 'observer', department: '監査部' },
    { id: '4', name: '裕士 管理者', role: 'admin', department: '情報システム部' },
];

export const MOCK_ROOMS: Room[] = [
    { id: 'room-a', name: 'コラボルームA', capacity: 4, facilities: ['モニター', 'ホワイトボード'], floor: '10F' },
    { id: 'room-b', name: 'コラボルームB', capacity: 6, facilities: ['プロジェクター', 'WEB会議システム'], floor: '10F' },
    { id: 'room-c', name: 'コラボルームC', capacity: 8, facilities: ['大型モニター', '防音', 'ホワイトボード'], floor: '10F' },
];

export const MOCK_RESERVATIONS: Reservation[] = [
    {
        id: 'res-1',
        roomId: 'room-a',
        userId: '1',
        userName: '叶会 太郎',
        startTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
        endTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(), // Today 10-11
        purpose: 'チーム定例会',
        participants: 4,
        status: 'approved',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // 2 days ago
        qrCode: 'mock-qr-code-string',
    },
    {
        id: 'res-2',
        roomId: 'room-b',
        userId: '1',
        userName: '叶会 太郎',
        startTime: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 0, 0, 0).toString(), // Tomorrow 14:00 (Fixed via ISO in logic usually, but here simplicity)
        endTime: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16, 0, 0, 0).toString(),
        purpose: '外部ベンダー打ち合わせ',
        participants: 2,
        status: 'pending',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    }
];

// Fix dates to properly be ISO strings for the second item
MOCK_RESERVATIONS[1].startTime = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(); // Tomorrow
const t = new Date(new Date().setDate(new Date().getDate() + 1));
t.setHours(14, 0, 0, 0);
MOCK_RESERVATIONS[1].startTime = t.toISOString();
t.setHours(16, 0, 0, 0);
MOCK_RESERVATIONS[1].endTime = t.toISOString();
