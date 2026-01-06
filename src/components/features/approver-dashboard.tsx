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
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant={res.status === 'pending' ? 'secondary' : res.status === 'approved' ? 'default' : 'destructive'}>
                                                {res.status === 'approved' ? '承認済' : res.status === 'pending' ? '承認待ち' : res.status === 'cancelled' ? '取消' : '却下'}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">申請日時: {created}</span>
                                        </div>
                                        <div className="font-bold text-xl">{res.purpose} <span className="text-base font-normal text-muted-foreground">by {res.userName}</span></div>

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
