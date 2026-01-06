"use client";

import { useState } from "react";
import { User, Room, Reservation } from "@/types";
import { MOCK_ROOMS, MOCK_RESERVATIONS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReservationModal } from "./reservation-modal";
import { Plus, Calendar, Clock, MapPin, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicantDashboardProps {
    user: User;
}

export function ApplicantDashboard({ user }: ApplicantDashboardProps) {
    const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

    // Filter my reservations
    const myReservations = reservations.filter(r => r.userId === user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calendar setup
    const timeSlots = Array.from({ length: 9 }, (_, i) => 10 + i); // 10:00 - 18:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getReservationForSlot = (roomId: string, hour: number) => {
        const slotStart = new Date(today);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(today);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        return reservations.find(r => {
            const rStart = new Date(r.startTime);
            const rEnd = new Date(r.endTime);
            return r.roomId === roomId && r.status !== 'cancelled' && r.status !== 'rejected' &&
                (rStart < slotEnd && rEnd > slotStart);
        });
    };

    const handleSlotClick = (room: Room, hour: number) => {
        const existing = getReservationForSlot(room.id, hour);
        if (existing) return; // Can't book occupied

        setSelectedRoom(room);
        const time = new Date(today);
        time.setHours(hour, 0, 0, 0);
        setSelectedTime(time.toISOString());
        setIsModalOpen(true);
    };

    const handleCreate = (data: { purpose: string, participants: number }) => {
        if (!selectedRoom || !selectedTime) return;

        const startTime = new Date(selectedTime);
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1); // 1 hour slot fixed for mock

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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content: Calendar */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">空き状況カレンダー</h2>
                        <p className="text-muted-foreground">{today.toLocaleDateString('ja-JP')} の状況</p>
                    </div>
                    <Button variant="outline" className="hidden sm:flex">
                        <Calendar className="mr-2 h-4 w-4" />
                        日付変更
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[600px] border rounded-lg">
                        {/* Header */}
                        <div className="flex border-b bg-muted/50">
                            <div className="w-20 p-3 font-medium text-center border-r">時間</div>
                            {MOCK_ROOMS.map(room => (
                                <div key={room.id} className="flex-1 p-3 font-medium text-center border-r last:border-r-0">
                                    {room.name}
                                    <div className="text-xs text-muted-foreground font-normal">定員{room.capacity}名</div>
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        {timeSlots.map(hour => (
                            <div key={hour} className="flex border-b last:border-b-0 h-20">
                                <div className="w-20 p-2 text-sm text-center border-r flex items-center justify-center bg-muted/10">
                                    {hour}:00
                                </div>
                                {MOCK_ROOMS.map(room => {
                                    const res = getReservationForSlot(room.id, hour);
                                    const isMine = res?.userId === user.id;

                                    return (
                                        <div
                                            key={room.id}
                                            className={cn(
                                                "flex-1 border-r last:border-r-0 p-1 relative group transition-colors",
                                                !res ? "hover:bg-accent/50 cursor-pointer" : "bg-muted/10"
                                            )}
                                            onClick={() => handleSlotClick(room, hour)}
                                        >
                                            {res ? (
                                                <div className={cn(
                                                    "w-full h-full rounded p-2 text-xs flex flex-col justify-center",
                                                    isMine ? "bg-primary/10 border border-primary/20" : "bg-muted border border-border"
                                                )}>
                                                    <div className="font-semibold truncate">{res.userName}</div>
                                                    <div className="truncate text-muted-foreground">{res.purpose}</div>
                                                    {isMine && <Badge variant="outline" className="w-fit mt-1 scale-75 origin-top-left bg-background">{res.status === 'approved' ? '承認済' : '申請中'}</Badge>}
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <Plus className="h-5 w-5 text-primary" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
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
                selectedTime={selectedTime}
            />
        </div>
    );
}
