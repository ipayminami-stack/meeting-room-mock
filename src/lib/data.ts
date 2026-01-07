import { Room, User, Reservation } from '@/types';

export const MOCK_USERS: User[] = [
    { id: '1', name: '叶 太郎', role: 'applicant', department: 'CoE推進部' },
    { id: '2', name: '吉田 課長', role: 'approver', department: 'CoE推進部' },
    { id: '3', name: '中山 次郎', role: 'observer', department: '監査部' },
    { id: '4', name: '吉田 太郎', role: 'admin', department: '情報システム部' },
    { id: '5', name: '鈴木 三郎', role: 'applicant', department: '営業部' },
    { id: '6', name: '高橋 美咲', role: 'applicant', department: 'マーケティング部' },
];

export const MOCK_ROOMS: Room[] = [
    { id: 'room-a', name: 'コラボルームA', capacity: 4, facilities: ['モニター', 'ホワイトボード'], floor: '10F' },
    { id: 'room-b', name: 'コラボルームB', capacity: 6, facilities: ['プロジェクター', 'WEB会議システム'], floor: '10F' },
    { id: 'room-c', name: 'コラボルームC', capacity: 8, facilities: ['大型モニター', '防音', 'ホワイトボード'], floor: '10F' },
];

// Helper function to create dates
const createDate = (daysOffset: number, hour: number, minute: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
};

export const MOCK_RESERVATIONS: Reservation[] = [
    // 承認済み - 今日
    {
        id: 'res-1',
        roomId: 'room-a',
        userId: '1',
        userName: '叶 太郎',
        startTime: createDate(0, 10, 0),
        endTime: createDate(0, 11, 0),
        purpose: 'チーム定例会',
        participants: 4,
        status: 'approved',
        createdAt: createDate(-2, 9, 0),
        qrCode: 'mock-qr-code-1',
    },

    // 承認済み - 明日
    {
        id: 'res-2',
        roomId: 'room-b',
        userId: '5',
        userName: '鈴木 三郎',
        startTime: createDate(1, 14, 0),
        endTime: createDate(1, 16, 0),
        purpose: '営業戦略会議',
        participants: 6,
        status: 'approved',
        createdAt: createDate(-1, 15, 30),
        qrCode: 'mock-qr-code-2',
        externalVisitors: [
            {
                company: '株式会社ABC商事',
                name: '山田 太郎',
                email: 'yamada@abc-corp.jp'
            }
        ]
    },

    // 申請中 - 明後日
    {
        id: 'res-3',
        roomId: 'room-a',
        userId: '1',
        userName: '叶 太郎',
        startTime: createDate(2, 10, 0),
        endTime: createDate(2, 12, 0),
        purpose: '新規プロジェクトキックオフ',
        participants: 4,
        status: 'pending',
        createdAt: createDate(0, 8, 30),
    },

    // 申請中 - 明後日
    {
        id: 'res-4',
        roomId: 'room-c',
        userId: '6',
        userName: '高橋 美咲',
        startTime: createDate(2, 13, 0),
        endTime: createDate(2, 15, 0),
        purpose: 'マーケティング施策検討会',
        participants: 5,
        status: 'pending',
        createdAt: createDate(0, 9, 15),
    },

    // 申請中 - 3日後
    {
        id: 'res-5',
        roomId: 'room-b',
        userId: '5',
        userName: '鈴木 三郎',
        startTime: createDate(3, 15, 0),
        endTime: createDate(3, 17, 0),
        purpose: '顧客プレゼンテーション準備',
        participants: 3,
        status: 'pending',
        createdAt: createDate(0, 10, 0),
        externalVisitors: [
            {
                company: 'XYZ株式会社',
                name: '佐々木 健太',
                email: 'sasaki@xyz-inc.jp'
            },
            {
                company: 'XYZ株式会社',
                name: '伊藤 美香',
                email: 'ito@xyz-inc.jp'
            }
        ]
    },

    // 申請中 - 4日後
    {
        id: 'res-6',
        roomId: 'room-a',
        userId: '1',
        userName: '叶 太郎',
        startTime: createDate(4, 11, 0),
        endTime: createDate(4, 12, 0),
        purpose: '週次進捗報告会',
        participants: 4,
        status: 'pending',
        createdAt: createDate(0, 11, 20),
    },

    // 却下済み - 昨日
    {
        id: 'res-7',
        roomId: 'room-c',
        userId: '6',
        userName: '高橋 美咲',
        startTime: createDate(-1, 16, 0),
        endTime: createDate(-1, 18, 0),
        purpose: '社内イベント企画会議',
        participants: 8,
        status: 'rejected',
        createdAt: createDate(-3, 14, 0),
        rejectionReason: '定員オーバーのため。コラボルームCの定員は8名ですが、参加者が10名を超える見込みです。より大きな会議室をご利用ください。',
    },

    // 却下済み - 2日前
    {
        id: 'res-8',
        roomId: 'room-a',
        userId: '5',
        userName: '鈴木 三郎',
        startTime: createDate(-2, 9, 0),
        endTime: createDate(-2, 10, 0),
        purpose: '個人作業スペース',
        participants: 1,
        status: 'rejected',
        createdAt: createDate(-4, 16, 30),
        rejectionReason: 'コラボルームは会議・打ち合わせ用です。個人作業の場合は、フリーアドレススペースをご利用ください。',
    },

    // 承認済み - 5日後
    {
        id: 'res-9',
        roomId: 'room-b',
        userId: '1',
        userName: '叶 太郎',
        startTime: createDate(5, 13, 0),
        endTime: createDate(5, 15, 0),
        purpose: '四半期レビュー会議',
        participants: 6,
        status: 'approved',
        createdAt: createDate(-1, 10, 0),
        qrCode: 'mock-qr-code-3',
    },

    // 承認済み - 6日後
    {
        id: 'res-10',
        roomId: 'room-c',
        userId: '6',
        userName: '高橋 美咲',
        startTime: createDate(6, 10, 0),
        endTime: createDate(6, 12, 0),
        purpose: '新商品発表会リハーサル',
        participants: 7,
        status: 'approved',
        createdAt: createDate(-2, 11, 0),
        qrCode: 'mock-qr-code-4',
        externalVisitors: [
            {
                company: 'デザイン株式会社',
                name: '木村 拓也',
                email: 'kimura@design-co.jp'
            }
        ]
    },

    // 取り下げ - 昨日
    {
        id: 'res-11',
        roomId: 'room-a',
        userId: '1',
        userName: '叶 太郎',
        startTime: createDate(-1, 14, 0),
        endTime: createDate(-1, 15, 0),
        purpose: '臨時ミーティング',
        participants: 3,
        status: 'cancelled',
        createdAt: createDate(-2, 16, 0),
    },

    // 申請中 - 7日後
    {
        id: 'res-12',
        roomId: 'room-b',
        userId: '5',
        userName: '鈴木 三郎',
        startTime: createDate(7, 16, 0),
        endTime: createDate(7, 18, 0),
        purpose: '来期計画策定会議',
        participants: 5,
        status: 'pending',
        createdAt: createDate(0, 12, 0),
        externalVisitors: [
            {
                company: 'コンサルティング合同会社',
                name: '中村 誠',
                email: 'nakamura@consulting-llc.jp'
            }
        ]
    },
];
