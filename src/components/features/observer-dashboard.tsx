"use client";

import { useState } from "react";
import { User, Reservation } from "@/types";
import { MOCK_ROOMS, MOCK_RESERVATIONS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Calendar, Clock, MapPin, Users as UsersIcon, ChevronLeft, ChevronRight, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface ObserverDashboardProps {
    user: User;
}

export function ObserverDashboard({ user }: ObserverDashboardProps) {
    const [reservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [roomFilter, setRoomFilter] = useState<string>("all");
    const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>(undefined);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Calendar utilities
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getReservationsForDate = (date: Date) => {
        const dateStr = date.toDateString();
        return reservations.filter(r => {
            const rDate = new Date(r.startTime);
            return rDate.toDateString() === dateStr && r.status !== 'cancelled' && r.status !== 'rejected';
        }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const filteredReservations = reservations.filter(r => {
        if (statusFilter !== "all" && r.status !== statusFilter) return false;
        if (roomFilter !== "all" && r.roomId !== roomFilter) return false;
        return true;
    }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    const days = getDaysInMonth(currentMonth);
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
    const monthYearStr = `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月`;

    const handleReservationClick = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">予約状況参照</h1>
                <p className="text-muted-foreground">全ての予約状況を確認できます（参照のみ）</p>
            </div>

            {/* Monthly Calendar */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">月間カレンダー</h2>
                            <p className="text-sm text-muted-foreground">{monthYearStr}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={prevMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={nextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 overflow-hidden">
                    <div className="grid grid-cols-7 gap-0.5">
                        {weekDays.map((day, i) => (
                            <div key={day} className={cn(
                                "text-center text-sm font-medium p-2",
                                i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-muted-foreground"
                            )}>
                                {day}
                            </div>
                        ))}

                        {days.map((date, index) => {
                            if (!date) {
                                return <div key={`empty-${index}`} className="aspect-square" />;
                            }

                            const dayReservations = getReservationsForDate(date);
                            const isToday = date.toDateString() === new Date().toDateString();
                            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                            const dayOfWeek = date.getDay();

                            return (
                                <div
                                    key={date.toISOString()}
                                    className={cn(
                                        "min-h-[100px] border rounded-lg p-2 relative",
                                        isToday && "border-primary border-2",
                                        isPast && "bg-muted/30",
                                        dayOfWeek === 0 && "bg-red-50/50",
                                        dayOfWeek === 6 && "bg-blue-50/50"
                                    )}
                                >
                                    <div className={cn(
                                        "text-sm font-medium mb-1",
                                        isToday && "text-primary font-bold",
                                        dayOfWeek === 0 && "text-red-600",
                                        dayOfWeek === 6 && "text-blue-600"
                                    )}>
                                        {date.getDate()}
                                    </div>

                                    <div className="space-y-1">
                                        {dayReservations.slice(0, 2).map((res) => {
                                            const room = MOCK_ROOMS.find(r => r.id === res.roomId);
                                            const startTime = new Date(res.startTime);
                                            const timeStr = `${startTime.getHours()}:${String(startTime.getMinutes()).padStart(2, '0')}`;

                                            return (
                                                <div
                                                    key={res.id}
                                                    className="text-xs px-1.5 py-1 rounded bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80"
                                                    onClick={() => handleReservationClick(res)}
                                                    title={`${timeStr} ${room?.name} - ${res.purpose}`}
                                                >
                                                    <div className="font-medium truncate">{timeStr} {room?.name.slice(-1)}</div>
                                                </div>
                                            );
                                        })}
                                        {dayReservations.length > 2 && (
                                            <div className="text-xs text-center text-muted-foreground bg-muted/50 rounded py-0.5">
                                                他 {dayReservations.length - 2}件
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Reservation List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">予約一覧</h2>
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border rounded px-3 py-1 text-sm"
                            >
                                <option value="all">全てのステータス</option>
                                <option value="approved">承認済</option>
                                <option value="pending">申請中</option>
                                <option value="rejected">却下</option>
                            </select>
                            <select
                                value={roomFilter}
                                onChange={(e) => setRoomFilter(e.target.value)}
                                className="border rounded px-3 py-1 text-sm"
                            >
                                <option value="all">全ての部屋</option>
                                {MOCK_ROOMS.map(room => (
                                    <option key={room.id} value={room.id}>{room.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredReservations.length === 0 && (
                            <div className="text-center p-8 text-muted-foreground">
                                該当する予約はありません
                            </div>
                        )}
                        {filteredReservations.map(res => {
                            const start = new Date(res.startTime);
                            const end = new Date(res.endTime);
                            const dateStr = start.toLocaleDateString('ja-JP');
                            const timeStr = `${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')} - ${end.getHours()}:${String(end.getMinutes()).padStart(2, '0')}`;
                            const roomName = MOCK_ROOMS.find(r => r.id === res.roomId)?.name || "不明な部屋";

                            return (
                                <div
                                    key={res.id}
                                    className="border rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                                    onClick={() => handleReservationClick(res)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="font-semibold">{res.purpose}</div>
                                        <Badge variant={res.status === 'approved' ? 'default' : res.status === 'pending' ? 'secondary' : 'destructive'}>
                                            {res.status === 'approved' ? '承認済' : res.status === 'pending' ? '申請中' : '却下'}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <MapPin className="mr-1 h-3 w-3" /> {roomName}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="mr-1 h-3 w-3" /> {dateStr} {timeStr}
                                        </div>
                                        <div className="flex items-center">
                                            <UsersIcon className="mr-1 h-3 w-3" /> {res.participants}名
                                        </div>
                                        <div className="text-xs">申請者: {res.userName}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Detail Modal */}
            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="予約詳細">
                {selectedReservation && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold">{selectedReservation.purpose}</h3>
                            <Badge variant={selectedReservation.status === 'approved' ? 'default' : selectedReservation.status === 'pending' ? 'secondary' : 'destructive'}>
                                {selectedReservation.status === 'approved' ? '承認済' : selectedReservation.status === 'pending' ? '申請中' : '却下'}
                            </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="mr-2 h-4 w-4" />
                                {MOCK_ROOMS.find(r => r.id === selectedReservation.roomId)?.name}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Clock className="mr-2 h-4 w-4" />
                                {new Date(selectedReservation.startTime).toLocaleString('ja-JP')} - {new Date(selectedReservation.endTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <UsersIcon className="mr-2 h-4 w-4" />
                                {selectedReservation.participants}名
                            </div>
                            <div className="text-muted-foreground">
                                申請者: {selectedReservation.userName}
                            </div>
                        </div>

                        {selectedReservation.externalVisitors && selectedReservation.externalVisitors.length > 0 && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm space-y-2">
                                <div className="font-medium text-blue-900">外部来訪者</div>
                                {selectedReservation.externalVisitors.map((visitor, idx) => (
                                    <div key={idx} className="text-blue-700 pl-2 border-l-2 border-blue-300">
                                        <div className="font-medium">{visitor.name}</div>
                                        <div className="text-xs opacity-80">📍 {visitor.company}</div>
                                        <div className="text-xs opacity-80">📧 {visitor.email}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedReservation.rejectionReason && (
                            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded text-sm">
                                <div className="font-medium">却下理由</div>
                                <div>{selectedReservation.rejectionReason}</div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t">
                            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>閉じる</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
