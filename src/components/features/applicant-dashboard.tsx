"use client";

import { useState } from "react";
import { User, Room, Reservation } from "@/types";
import { MOCK_ROOMS, MOCK_RESERVATIONS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReservationModal } from "./reservation-modal";
import { Plus, Calendar, Clock, MapPin, Users as UsersIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicantDashboardProps {
    user: User;
}

export function ApplicantDashboard({ user }: ApplicantDashboardProps) {
    const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Filter my reservations
    const myReservations = reservations.filter(r => r.userId === user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calendar utilities
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days in month
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
        });
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setSelectedRoom(MOCK_ROOMS[0]); // Default to first room
        setIsModalOpen(true);
    };

    const handleCreate = (data: { purpose: string, participants: number }) => {
        if (!selectedRoom || !selectedDate) return;

        const startTime = new Date(selectedDate);
        startTime.setHours(10, 0, 0, 0); // Default 10:00 start
        const endTime = new Date(startTime);
        endTime.setHours(11, 0, 0, 0); // 1 hour duration

        const newRes: Reservation = {
            id: `new-${Date.now()}`,
            roomId: selectedRoom.id,
            userId: user.id,
            userName: user.name,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            purpose: data.purpose,
            participants: data.participants,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        setReservations([...reservations, newRes]);
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const days = getDaysInMonth(currentMonth);
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
    const monthYearStr = `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content: Monthly Calendar */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">空き状況カレンダー</h2>
                        <p className="text-muted-foreground">{monthYearStr}</p>
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

                <Card>
                    <CardContent className="p-4">
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Week day headers */}
                            {weekDays.map((day, i) => (
                                <div key={day} className={cn(
                                    "text-center text-sm font-medium p-2",
                                    i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-muted-foreground"
                                )}>
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
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
                                            "aspect-square border rounded-lg p-2 cursor-pointer transition-colors relative",
                                            isToday && "border-primary border-2",
                                            isPast ? "bg-muted/30 cursor-not-allowed" : "hover:bg-accent/50",
                                            dayOfWeek === 0 && "bg-red-50/50",
                                            dayOfWeek === 6 && "bg-blue-50/50"
                                        )}
                                        onClick={() => !isPast && handleDayClick(date)}
                                    >
                                        <div className={cn(
                                            "text-sm font-medium mb-1",
                                            isToday && "text-primary font-bold",
                                            dayOfWeek === 0 && "text-red-600",
                                            dayOfWeek === 6 && "text-blue-600"
                                        )}>
                                            {date.getDate()}
                                        </div>

                                        {/* Reservation indicators */}
                                        <div className="space-y-0.5">
                                            {dayReservations.slice(0, 2).map((res, i) => {
                                                const isMine = res.userId === user.id;
                                                return (
                                                    <div
                                                        key={res.id}
                                                        className={cn(
                                                            "text-xs px-1 py-0.5 rounded truncate",
                                                            isMine ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                                        )}
                                                        title={`${res.purpose} (${MOCK_ROOMS.find(r => r.id === res.roomId)?.name})`}
                                                    >
                                                        {MOCK_ROOMS.find(r => r.id === res.roomId)?.name.slice(-1)}
                                                    </div>
                                                );
                                            })}
                                            {dayReservations.length > 2 && (
                                                <div className="text-xs text-muted-foreground">
                                                    +{dayReservations.length - 2}
                                                </div>
                                            )}
                                        </div>

                                        {!isPast && dayReservations.length === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
                                                <Plus className="h-4 w-4 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-primary/20"></div>
                                <span>自分の予約</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-muted"></div>
                                <span>他の予約</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar: My Reservations */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">自分の予約</h2>
                </div>

                <div className="space-y-4">
                    {myReservations.length === 0 && (
                        <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                            予約履歴はありません
                        </div>
                    )}
                    {myReservations.map(res => {
                        const start = new Date(res.startTime);
                        const end = new Date(res.endTime);
                        const dateStr = start.toLocaleDateString('ja-JP');
                        const timeStr = `${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')} - ${end.getHours()}:${String(end.getMinutes()).padStart(2, '0')}`;
                        const roomName = MOCK_ROOMS.find(r => r.id === res.roomId)?.name || "不明な部屋";

                        return (
                            <Card key={res.id}>
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant={res.status === 'approved' ? 'default' : res.status === 'pending' ? 'secondary' : 'destructive'}>
                                            {res.status === 'approved' ? '承認済' : res.status === 'pending' ? '申請中' : res.status === 'cancelled' ? '取消' : '却下'}
                                        </Badge>
                                        {res.status === 'approved' && (
                                            <Button variant="ghost" size="sm" className="h-6 text-xs">QR表示</Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-2 space-y-2 text-sm">
                                    <div className="font-semibold text-lg">{res.purpose}</div>
                                    <div className="flex items-center text-muted-foreground">
                                        <MapPin className="mr-2 h-4 w-4" /> {roomName}
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Clock className="mr-2 h-4 w-4" /> {dateStr} {timeStr}
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <UsersIcon className="mr-2 h-4 w-4" /> {res.participants}名
                                    </div>
                                    {res.rejectionReason && (
                                        <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded text-xs">
                                            理由: {res.rejectionReason}
                                        </div>
                                    )}
                                    {res.status === 'pending' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => {
                                                setReservations(reservations.map(r => r.id === res.id ? { ...r, status: 'cancelled' } : r));
                                            }}
                                        >
                                            申請を取り下げる
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
                selectedRoom={selectedRoom}
                selectedTime={selectedDate?.toISOString()}
            />
        </div>
    );
}
