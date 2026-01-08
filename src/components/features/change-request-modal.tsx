"use client";

import { useState, useEffect } from "react";
import { Reservation, Room } from "@/types";
import { MOCK_ROOMS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { requiresApproval } from "@/lib/changeRequestUtils";
import { X, AlertCircle } from "lucide-react";

interface ChangeRequestModalProps {
    reservation: Reservation;
    onClose: () => void;
    onSubmit: (changes: Reservation['changes'], changeReason: string, requiresApproval: boolean) => void;
}

export function ChangeRequestModal({ reservation, onClose, onSubmit }: ChangeRequestModalProps) {
    const [startTime, setStartTime] = useState(new Date(reservation.startTime));
    const [endTime, setEndTime] = useState(new Date(reservation.endTime));
    const [roomId, setRoomId] = useState(reservation.roomId);
    const [purpose, setPurpose] = useState(reservation.purpose);
    const [participants, setParticipants] = useState(reservation.participants);
    const [externalVisitors, setExternalVisitors] = useState(reservation.externalVisitors || []);
    const [changeReason, setChangeReason] = useState("");
    const [needsApproval, setNeedsApproval] = useState(false);

    // 変更内容を検出して承認要否を判定
    useEffect(() => {
        const changes: Reservation['changes'] = [];

        if (startTime.toISOString() !== reservation.startTime) {
            changes.push({ field: 'startTime', oldValue: reservation.startTime, newValue: startTime.toISOString() });
        }
        if (endTime.toISOString() !== reservation.endTime) {
            changes.push({ field: 'endTime', oldValue: reservation.endTime, newValue: endTime.toISOString() });
        }
        if (roomId !== reservation.roomId) {
            changes.push({ field: 'roomId', oldValue: reservation.roomId, newValue: roomId });
        }
        if (purpose !== reservation.purpose) {
            changes.push({ field: 'purpose', oldValue: reservation.purpose, newValue: purpose });
        }
        if (participants !== reservation.participants) {
            changes.push({ field: 'participants', oldValue: reservation.participants, newValue: participants });
        }
        if (JSON.stringify(externalVisitors) !== JSON.stringify(reservation.externalVisitors || [])) {
            changes.push({ field: 'externalVisitors', oldValue: reservation.externalVisitors || [], newValue: externalVisitors });
        }

        setNeedsApproval(requiresApproval(changes));
    }, [startTime, endTime, roomId, purpose, participants, externalVisitors, reservation]);

    const handleSubmit = () => {
        const changes: Reservation['changes'] = [];

        if (startTime.toISOString() !== reservation.startTime) {
            changes.push({ field: 'startTime', oldValue: reservation.startTime, newValue: startTime.toISOString() });
        }
        if (endTime.toISOString() !== reservation.endTime) {
            changes.push({ field: 'endTime', oldValue: reservation.endTime, newValue: endTime.toISOString() });
        }
        if (roomId !== reservation.roomId) {
            changes.push({ field: 'roomId', oldValue: reservation.roomId, newValue: roomId });
        }
        if (purpose !== reservation.purpose) {
            changes.push({ field: 'purpose', oldValue: reservation.purpose, newValue: purpose });
        }
        if (participants !== reservation.participants) {
            changes.push({ field: 'participants', oldValue: reservation.participants, newValue: participants });
        }
        if (JSON.stringify(externalVisitors) !== JSON.stringify(reservation.externalVisitors || [])) {
            changes.push({ field: 'externalVisitors', oldValue: reservation.externalVisitors || [], newValue: externalVisitors });
        }

        if (changes.length === 0) {
            alert('変更内容がありません');
            return;
        }

        if (needsApproval && !changeReason.trim()) {
            alert('承認が必要な変更の場合、変更理由を入力してください');
            return;
        }

        onSubmit(changes, changeReason, needsApproval);
    };

    const addVisitor = () => {
        setExternalVisitors([...externalVisitors, { company: '', name: '', email: '' }]);
    };

    const removeVisitor = (index: number) => {
        setExternalVisitors(externalVisitors.filter((_, i) => i !== index));
    };

    const updateVisitor = (index: number, field: 'company' | 'name' | 'email', value: string) => {
        const updated = [...externalVisitors];
        updated[index] = { ...updated[index], [field]: value };
        setExternalVisitors(updated);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">予約の変更</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {needsApproval && (
                        <div className="bg-orange-50 border border-orange-200 rounded p-3 flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-orange-900">
                                <div className="font-semibold">この変更には承認が必要です</div>
                                <div className="text-xs mt-1">変更申請として送信され、承認者の承認後に反映されます。</div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">日時</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="datetime-local"
                                value={startTime.toISOString().slice(0, 16)}
                                onChange={(e) => setStartTime(new Date(e.target.value))}
                                className="border rounded px-3 py-2 text-sm"
                            />
                            <input
                                type="datetime-local"
                                value={endTime.toISOString().slice(0, 16)}
                                onChange={(e) => setEndTime(new Date(e.target.value))}
                                className="border rounded px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">部屋</label>
                        <select
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                        >
                            {MOCK_ROOMS.map(room => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">利用目的</label>
                        <input
                            type="text"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">参加人数</label>
                        <input
                            type="number"
                            min="1"
                            value={participants}
                            onChange={(e) => setParticipants(parseInt(e.target.value))}
                            className="w-full border rounded px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">外部来訪者</label>
                            <Button type="button" variant="outline" size="sm" onClick={addVisitor}>
                                + 追加
                            </Button>
                        </div>
                        {externalVisitors.map((visitor, idx) => (
                            <div key={idx} className="border rounded p-3 mb-2 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">来訪者 {idx + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeVisitor(idx)}
                                        className="text-destructive hover:text-destructive/80 text-sm"
                                    >
                                        削除
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="会社名"
                                    value={visitor.company}
                                    onChange={(e) => updateVisitor(idx, 'company', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="氏名"
                                    value={visitor.name}
                                    onChange={(e) => updateVisitor(idx, 'name', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="メールアドレス"
                                    value={visitor.email}
                                    onChange={(e) => updateVisitor(idx, 'email', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                        ))}
                    </div>

                    {needsApproval && (
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                変更理由 <span className="text-destructive">*</span>
                            </label>
                            <textarea
                                value={changeReason}
                                onChange={(e) => setChangeReason(e.target.value)}
                                placeholder="変更理由を入力してください"
                                className="w-full border rounded px-3 py-2 text-sm h-20"
                                required
                            />
                        </div>
                    )}

                    <div className="flex gap-2 pt-4">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            キャンセル
                        </Button>
                        <Button onClick={handleSubmit} className="flex-1">
                            {needsApproval ? '変更申請を送信' : '変更を保存'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
