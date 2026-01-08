import { Reservation } from '@/types';

/**
 * 変更内容が承認を必要とするかどうかを判定
 */
export function requiresApproval(changes: Reservation['changes']): boolean {
    if (!changes || changes.length === 0) return false;

    for (const change of changes) {
        // 日時、目的、部屋の変更は常に承認が必要
        if (change.field === 'startTime' ||
            change.field === 'endTime' ||
            change.field === 'purpose' ||
            change.field === 'roomId') {
            return true;
        }

        // 参加人数の増加は承認が必要
        if (change.field === 'participants') {
            const oldValue = Number(change.oldValue);
            const newValue = Number(change.newValue);
            if (newValue > oldValue) {
                return true;
            }
        }

        // 外部来訪者の追加・変更は承認が必要
        if (change.field === 'externalVisitors') {
            const oldVisitors = (change.oldValue as any[]) || [];
            const newVisitors = (change.newValue as any[]) || [];

            // 来訪者数の増加
            if (newVisitors.length > oldVisitors.length) {
                return true;
            }

            // 来訪者の内容変更（削減以外）
            if (JSON.stringify(oldVisitors) !== JSON.stringify(newVisitors)) {
                // 削減のみの場合は承認不要
                const isOnlyReduction = newVisitors.length < oldVisitors.length &&
                    newVisitors.every((nv, idx) =>
                        JSON.stringify(nv) === JSON.stringify(oldVisitors[idx])
                    );
                if (!isOnlyReduction) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 * 変更内容を人間が読める形式に変換
 */
export function formatChangeDescription(change: NonNullable<Reservation['changes']>[0], rooms?: any[]): string {
    const fieldNames: Record<string, string> = {
        startTime: '開始時刻',
        endTime: '終了時刻',
        purpose: '利用目的',
        participants: '参加人数',
        externalVisitors: '外部来訪者',
        roomId: '部屋'
    };

    const fieldName = fieldNames[change.field] || change.field;

    if (change.field === 'startTime' || change.field === 'endTime') {
        const oldTime = new Date(change.oldValue).toLocaleString('ja-JP', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        const newTime = new Date(change.newValue).toLocaleString('ja-JP', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${fieldName}: ${oldTime} → ${newTime}`;
    }

    if (change.field === 'roomId' && rooms) {
        const oldRoom = rooms.find(r => r.id === change.oldValue)?.name || change.oldValue;
        const newRoom = rooms.find(r => r.id === change.newValue)?.name || change.newValue;
        return `${fieldName}: ${oldRoom} → ${newRoom}`;
    }

    if (change.field === 'externalVisitors') {
        const oldCount = (change.oldValue as any[])?.length || 0;
        const newCount = (change.newValue as any[])?.length || 0;
        return `${fieldName}: ${oldCount}名 → ${newCount}名`;
    }

    return `${fieldName}: ${change.oldValue} → ${change.newValue}`;
}
