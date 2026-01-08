"use client";

import { useState } from "react";
import { User, Reservation } from "@/types";
import { MOCK_ROOMS, MOCK_RESERVATIONS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, MapPin, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApproverDashboardProps {
    user: User;
}

export function ApproverDashboard({ user }: ApproverDashboardProps) {
    const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

    const handleApprove = (id: string) => {
        setReservations(reservations.map(r =>
            r.id === id ? { ...r, status: 'approved', qrCode: 'valid-qr-' + Date.now() } : r
        ));
    };

    const handleReject = (id: string) => {
        // For simplicity, just strict reject. Ideally open a modal for reason.
        setReservations(reservations.map(r =>
            r.id === id ? { ...r, status: 'rejected', rejectionReason: '管理者の判断により却下されました' } : r
        ));
    };

    const pendingList = reservations.filter(r => r.status === 'pending').sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // FIFO
    const historyList = reservations.filter(r => r.status !== 'pending').sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    const displayedList = activeTab === 'pending' ? pendingList : historyList;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">承認ダッシュボード</h2>
                    <p className="text-muted-foreground">
                        {pendingList.length > 0 ? `未処理の申請が ${pendingList.length} 件あります` : "すべての申請を処理しました"}
                    </p>
                </div>
                <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            activeTab === 'pending' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:bg-background/50"
                        )}
                    >
                        未処理
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            activeTab === 'history' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:bg-background/50"
                        )}
                    >
                        処理履歴
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {displayedList.length === 0 && (
                    <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
                        {activeTab === 'pending' ? "承認待ちの申請はありません" : "履歴はありません"}
                    </div>
                )}
                {displayedList.map(res => {
                    const start = new Date(res.startTime);
                    const end = new Date(res.endTime);
                    const roomName = MOCK_ROOMS.find(r => r.id === res.roomId)?.name || "不明な部屋";
                    const created = new Date(res.createdAt).toLocaleString('ja-JP');

                    return (
                        <Card key={res.id} className={cn(activeTab === 'pending' ? "border-l-4 border-l-primary" : "")}>
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <Badge variant={res.status === 'pending' ? 'secondary' : res.status === 'approved' ? 'default' : 'destructive'}>
                                                {res.status === 'approved' ? '承認済' : res.status === 'pending' ? '承認待ち' : res.status === 'cancelled' ? '取消' : '却下'}
                                            </Badge>
                                            {res.isChangeRequest && (
                                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                                                    🔄 変更申請
                                                </Badge>
                                            )}
                                            <span className="text-sm text-muted-foreground">申請日時: {created}</span>
                                        </div>
                                        <div className="font-bold text-xl">{res.purpose} <span className="text-base font-normal text-muted-foreground">by {res.userName}</span></div>

                                        {res.isChangeRequest && res.changes && res.changes.length > 0 && (
                                            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded text-sm space-y-2">
                                                <div className="font-semibold text-orange-900">📝 変更内容</div>
                                                {res.changes.map((change, idx) => {
                                                    const fieldNames: Record<string, string> = {
                                                        startTime: '開始時刻',
                                                        endTime: '終了時刻',
                                                        purpose: '利用目的',
                                                        participants: '参加人数',
                                                        externalVisitors: '外部来訪者',
                                                        roomId: '部屋'
                                                    };

                                                    let displayValue: React.ReactNode = '';
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
                                                        displayValue = `${oldTime} → ${newTime}`;
                                                    } else if (change.field === 'roomId') {
                                                        const oldRoom = MOCK_ROOMS.find(r => r.id === change.oldValue)?.name || change.oldValue;
                                                        const newRoom = MOCK_ROOMS.find(r => r.id === change.newValue)?.name || change.newValue;
                                                        displayValue = `${oldRoom} → ${newRoom}`;
                                                    } else if (change.field === 'externalVisitors') {
                                                        const oldVisitors = (change.oldValue as any[]) || [];
                                                        const newVisitors = (change.newValue as any[]) || [];

                                                        // 追加された来訪者
                                                        const addedVisitors = newVisitors.filter(nv =>
                                                            !oldVisitors.some(ov =>
                                                                ov.name === nv.name && ov.email === nv.email
                                                            )
                                                        );

                                                        // 削除された来訪者
                                                        const removedVisitors = oldVisitors.filter(ov =>
                                                            !newVisitors.some(nv =>
                                                                nv.name === ov.name && nv.email === ov.email
                                                            )
                                                        );

                                                        displayValue = (
                                                            <div className="space-y-2 mt-1">
                                                                {addedVisitors.length > 0 && (
                                                                    <div className="bg-green-50 border border-green-200 rounded p-2">
                                                                        <div className="font-medium text-green-900 text-xs mb-1">➕ 追加</div>
                                                                        {addedVisitors.map((v, i) => (
                                                                            <div key={i} className="text-green-700 text-xs pl-2 border-l-2 border-green-300">
                                                                                <div className="font-medium">{v.name}</div>
                                                                                <div className="opacity-80">📍 {v.company}</div>
                                                                                <div className="opacity-80">📧 {v.email}</div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {removedVisitors.length > 0 && (
                                                                    <div className="bg-red-50 border border-red-200 rounded p-2">
                                                                        <div className="font-medium text-red-900 text-xs mb-1">➖ 削除</div>
                                                                        {removedVisitors.map((v, i) => (
                                                                            <div key={i} className="text-red-700 text-xs pl-2 border-l-2 border-red-300">
                                                                                <div className="font-medium">{v.name}</div>
                                                                                <div className="opacity-80">📍 {v.company}</div>
                                                                                <div className="opacity-80">📧 {v.email}</div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <div className="text-xs">{oldVisitors.length}名 → {newVisitors.length}名</div>
                                                            </div>
                                                        );
                                                    } else {
                                                        displayValue = `${change.oldValue} → ${change.newValue}`;
                                                    }

                                                    return (
                                                        <div key={idx} className="text-orange-700 pl-2 border-l-2 border-orange-300">
                                                            <span className="font-medium">{fieldNames[change.field] || change.field}:</span> {displayValue}
                                                        </div>
                                                    );
                                                })}
                                                {res.changeReason && (
                                                    <div className="mt-2 pt-2 border-t border-orange-200 text-orange-700">
                                                        <span className="font-medium">変更理由:</span> {res.changeReason}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <MapPin className="mr-1 h-4 w-4" /> {roomName}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-1 h-4 w-4" /> {start.toLocaleString('ja-JP')} - {end.getHours()}:{String(end.getMinutes()).padStart(2, '0')}
                                            </div>
                                            <div className="flex items-center">
                                                <UsersIcon className="mr-1 h-4 w-4" /> {res.participants}名
                                            </div>
                                        </div>

                                        {res.externalVisitors && res.externalVisitors.length > 0 && (
                                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm space-y-2">
                                                <div className="font-medium text-blue-900">外部来訪者</div>
                                                {res.externalVisitors.map((visitor, idx) => (
                                                    <div key={idx} className="text-blue-700 pl-2 border-l-2 border-blue-300">
                                                        <div className="font-medium">{visitor.name}</div>
                                                        <div className="text-xs opacity-80">📍 {visitor.company}</div>
                                                        <div className="text-xs opacity-80">📧 {visitor.email}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {activeTab === 'pending' && (
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleReject(res.id)}>
                                                <X className="mr-2 h-4 w-4" /> 却下
                                            </Button>
                                            <Button onClick={() => handleApprove(res.id)}>
                                                <Check className="mr-2 h-4 w-4" /> 承認
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
