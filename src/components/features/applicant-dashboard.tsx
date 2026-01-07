"use client";

import { useState } from "react";
import { User, Room, Reservation } from "@/types";
import { MOCK_ROOMS, MOCK_RESERVATIONS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ReservationModal } from "./reservation-modal";
import { Calendar, Clock, MapPin, Users as UsersIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicantDashboardProps {
    user: User;
}

export function ApplicantDashboard({ user }: ApplicantDashboardProps) {
    const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
    const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);
    const [isReservationFormModalOpen, setIsReservationFormModalOpen] = useState(false);
    const [selectedDayForDetail, setSelectedDayForDetail] = useState<Date | undefined>(undefined);
    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);
    const [selectedStartHour, setSelectedStartHour] = useState<number | null>(null);
    const [selectedEndHour, setSelectedEndHour] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
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

    const handleDayClick = (date: Date) => {
        setSelectedDayForDetail(date);
        clearSelection();
        setIsDayDetailModalOpen(true);
    };

    const clearSelection = () => {
        setSelectedRoom(undefined);
        setSelectedStartHour(null);
        setSelectedEndHour(null);
    };

    const handleTimeSlotMouseDown = (room: Room, hour: number, isOccupied: boolean) => {
        if (isOccupied) return;
        setIsDragging(true);
        setSelectedRoom(room);
        setSelectedStartHour(hour);
        setSelectedEndHour(hour + 1);
    };

    const handleTimeSlotMouseEnter = (room: Room, hour: number, isOccupied: boolean) => {
        if (!isDragging || !selectedRoom || selectedRoom.id !== room.id || isOccupied) return;

        if (selectedStartHour !== null) {
            if (hour < selectedStartHour) {
                setSelectedStartHour(hour);
            } else {
                setSelectedEndHour(hour + 1);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTimeSlotTouch = (room: Room, hour: number, isOccupied: boolean) => {
        if (isOccupied) return;

        if (!selectedRoom || selectedRoom.id !== room.id) {
            setSelectedRoom(room);
            setSelectedStartHour(hour);
            setSelectedEndHour(hour + 1);
        } else if (selectedStartHour !== null && selectedEndHour !== null) {
            if (hour < selectedStartHour) {
                setSelectedStartHour(hour);
            } else if (hour >= selectedEndHour) {
                setSelectedEndHour(hour + 1);
            } else if (hour === selectedStartHour - 1) {
                setSelectedStartHour(hour);
            } else if (hour === selectedEndHour) {
                setSelectedEndHour(hour + 1);
            }
        }
    };

    const handleProceedToForm = () => {
        setIsDayDetailModalOpen(false);
        setIsReservationFormModalOpen(true);
    };

    const handleReservationSubmit = (data: {
        purpose: string;
        participants: number;
        startTime: Date;
        endTime: Date;
        externalVisitors?: {
            company: string;
            name: string;
            email: string;
        }[];
    }) => {
        if (!selectedRoom) return;

        const newRes: Reservation = {
            id: `new-${Date.now()}`,
            roomId: selectedRoom.id,
            userId: user.id,
            userName: user.name,
            startTime: data.startTime.toISOString(),
            endTime: data.endTime.toISOString(),
            purpose: data.purpose,
            participants: data.participants,
            status: 'pending',
            createdAt: new Date().toISOString(),
            ...(data.externalVisitors && { externalVisitors: data.externalVisitors })
        };

        setReservations([...reservations, newRes]);
        setIsReservationFormModalOpen(false);
        clearSelection();
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
    const timeSlots = Array.from({ length: 9 }, (_, i) => 10 + i);

    const isSlotOccupied = (room: Room, hour: number) => {
        if (!selectedDayForDetail) return false;

        const slotStart = new Date(selectedDayForDetail);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(selectedDayForDetail);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        return reservations.some(r => {
            const rStart = new Date(r.startTime);
            const rEnd = new Date(r.endTime);
            return r.roomId === room.id && r.status !== 'cancelled' && r.status !== 'rejected' &&
                (rStart < slotEnd && rEnd > slotStart);
        });
    };

    const isSlotSelected = (room: Room, hour: number) => {
        if (!selectedRoom || selectedRoom.id !== room.id) return false;
        if (selectedStartHour === null || selectedEndHour === null) return false;
        return hour >= selectedStartHour && hour < selectedEndHour;
    };

    const hasSelection = selectedRoom && selectedStartHour !== null && selectedEndHour !== null;
    const selectionDuration = hasSelection ? selectedEndHour! - selectedStartHour! : 0;

    // Prepare selected time for ReservationModal
    const selectedTimeForModal = hasSelection && selectedDayForDetail ? (() => {
        const time = new Date(selectedDayForDetail);
        time.setHours(selectedStartHour!, 0, 0, 0);
        return time.toISOString();
    })() : undefined;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-full" onMouseUp={handleMouseUp} onTouchEnd={handleMouseUp}>
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
                                            "min-h-[120px] border rounded-lg p-2 cursor-pointer transition-colors relative",
                                            isToday && "border-primary border-2",
                                            isPast ? "bg-muted/30" : "hover:bg-accent/50",
                                            dayOfWeek === 0 && "bg-red-50/50",
                                            dayOfWeek === 6 && "bg-blue-50/50"
                                        )}
                                        onClick={() => handleDayClick(date)}
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
                                            {dayReservations.slice(0, 3).map((res) => {
                                                const isMine = res.userId === user.id;
                                                const room = MOCK_ROOMS.find(r => r.id === res.roomId);
                                                const startTime = new Date(res.startTime);
                                                const timeStr = `${startTime.getHours()}:${String(startTime.getMinutes()).padStart(2, '0')}`;

                                                return (
                                                    <div
                                                        key={res.id}
                                                        className={cn(
                                                            "text-xs px-1.5 py-1 rounded",
                                                            isMine ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground"
                                                        )}
                                                        title={`${timeStr} ${room?.name} - ${res.purpose}`}
                                                    >
                                                        <div className="font-medium truncate">{timeStr} {room?.name.slice(-1)}</div>
                                                        <div className="truncate opacity-80">{res.purpose}</div>
                                                    </div>
                                                );
                                            })}
                                            {dayReservations.length > 3 && (
                                                <div className="text-xs text-center text-muted-foreground bg-muted/50 rounded py-0.5">
                                                    他 {dayReservations.length - 3}件
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30"></div>
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
                                    {res.externalVisitors && res.externalVisitors.length > 0 && (
                                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs space-y-2">
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
                                    {res.status === 'approved' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => {
                                                if (confirm('承認済みの予約を取り消しますか？\n\nこの操作は取り消せません。')) {
                                                    setReservations(reservations.map(r => r.id === res.id ? { ...r, status: 'cancelled' } : r));
                                                }
                                            }}
                                        >
                                            予約を取り消す
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Day Detail Modal with Timeline Selection */}
            <Modal isOpen={isDayDetailModalOpen} onClose={() => setIsDayDetailModalOpen(false)}>
                {selectedDayForDetail && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">
                                    {selectedDayForDetail.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {selectedDayForDetail.toLocaleDateString('ja-JP', { weekday: 'long' })}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsDayDetailModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {hasSelection && (
                            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                                <div className="text-sm font-medium text-primary">選択中</div>
                                <div className="text-lg font-bold">
                                    {selectedRoom?.name} {selectedStartHour}:00 - {selectedEndHour}:00
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {selectionDuration}時間
                                </div>
                            </div>
                        )}

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                            💡 空いている時間枠を<strong>ドラッグ</strong>または<strong>タップ</strong>して予約時間を選択してください
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <div className="max-h-[50vh] overflow-y-auto">
                                {MOCK_ROOMS.map(room => (
                                    <div key={room.id} className="border-b last:border-b-0">
                                        <div className="bg-muted/50 px-3 py-2 font-medium text-sm">
                                            {room.name} <span className="text-xs text-muted-foreground">(定員{room.capacity}名)</span>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex gap-0.5 select-none">
                                                {timeSlots.map(hour => {
                                                    const isOccupied = isSlotOccupied(room, hour);
                                                    const isSelected = isSlotSelected(room, hour);
                                                    const isPast = selectedDayForDetail && new Date(selectedDayForDetail).setHours(hour + 1, 0, 0, 0) < Date.now();

                                                    return (
                                                        <div
                                                            key={hour}
                                                            className={cn(
                                                                "flex-1 h-12 border rounded cursor-pointer transition-all relative group",
                                                                isOccupied && "bg-red-100 border-red-300 cursor-not-allowed",
                                                                !isOccupied && !isPast && "bg-green-50 border-green-200 hover:bg-green-100",
                                                                isPast && !isOccupied && "bg-gray-100 border-gray-200 cursor-not-allowed",
                                                                isSelected && "bg-primary border-primary shadow-md scale-105"
                                                            )}
                                                            onMouseDown={() => handleTimeSlotMouseDown(room, hour, isOccupied || isPast)}
                                                            onMouseEnter={() => handleTimeSlotMouseEnter(room, hour, isOccupied || isPast)}
                                                            onTouchStart={() => handleTimeSlotTouch(room, hour, isOccupied || isPast)}
                                                            title={`${hour}:00-${hour + 1}:00 ${isOccupied ? '予約済' : isPast ? '過去' : '空き'}`}
                                                        >
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className={cn(
                                                                    "text-xs font-medium",
                                                                    isSelected && "text-white",
                                                                    !isSelected && isOccupied && "text-red-700",
                                                                    !isSelected && !isOccupied && !isPast && "text-green-700",
                                                                    !isSelected && isPast && "text-gray-500"
                                                                )}>
                                                                    {hour}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex gap-0.5 mt-1">
                                                {timeSlots.map(hour => (
                                                    <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
                                                        {hour === 10 || hour === 14 || hour === 18 ? `${hour}:00` : ''}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {hasSelection && (
                            <div className="border-t pt-4 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={clearSelection}>
                                    クリア
                                </Button>
                                <Button onClick={handleProceedToForm}>
                                    次へ →
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Reservation Form Modal */}
            <ReservationModal
                isOpen={isReservationFormModalOpen}
                onClose={() => {
                    setIsReservationFormModalOpen(false);
                    setIsDayDetailModalOpen(true);
                }}
                onSubmit={handleReservationSubmit}
                selectedRoom={selectedRoom}
                selectedTime={selectedTimeForModal}
            />
        </div>
    );
}
