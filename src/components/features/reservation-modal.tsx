"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Room } from "@/types";

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        purpose: string;
        participants: number;
        startTime: Date;
        endTime: Date;
        externalVisitors?: {
            companyName: string;
            visitorNames: string;
        };
    }) => void;
    selectedRoom?: Room;
    selectedTime?: string; // ISO string
}

export function ReservationModal({ isOpen, onClose, onSubmit, selectedRoom, selectedTime }: ReservationModalProps) {
    const [purpose, setPurpose] = useState("");
    const [participants, setParticipants] = useState("1");
    const [roomName, setRoomName] = useState("");
    const [hasExternalVisitors, setHasExternalVisitors] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [visitorNames, setVisitorNames] = useState("");

    // Time range state (in hours: 10-18)
    const [startHour, setStartHour] = useState(10);
    const [endHour, setEndHour] = useState(11);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const minHour = 10;
    const maxHour = 18;

    // Update form when props change
    useEffect(() => {
        if (selectedRoom) setRoomName(selectedRoom.name);
        if (selectedTime) {
            const date = new Date(selectedTime);
            setSelectedDate(date);
            const hour = date.getHours();
            setStartHour(hour >= minHour && hour < maxHour ? hour : minHour);
            setEndHour(hour >= minHour && hour < maxHour ? hour + 1 : minHour + 1);
        }
        setPurpose("");
        setParticipants("1");
        setHasExternalVisitors(false);
        setCompanyName("");
        setVisitorNames("");
    }, [selectedRoom, selectedTime, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const start = new Date(selectedDate);
        start.setHours(startHour, 0, 0, 0);

        const end = new Date(selectedDate);
        end.setHours(endHour, 0, 0, 0);

        const data: {
            purpose: string;
            participants: number;
            startTime: Date;
            endTime: Date;
            externalVisitors?: {
                companyName: string;
                visitorNames: string;
            };
        } = {
            purpose,
            participants: parseInt(participants),
            startTime: start,
            endTime: end
        };

        if (hasExternalVisitors && companyName && visitorNames) {
            data.externalVisitors = {
                companyName,
                visitorNames
            };
        }

        onSubmit(data);
        onClose();
    };

    const handleStartChange = (value: number) => {
        setStartHour(value);
        if (value >= endHour) {
            setEndHour(Math.min(value + 1, maxHour));
        }
    };

    const handleEndChange = (value: number) => {
        setEndHour(value);
        if (value <= startHour) {
            setStartHour(Math.max(value - 1, minHour));
        }
    };

    const duration = endHour - startHour;
    const formattedDate = selectedDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
    const timeRangeText = `${startHour}:00 - ${endHour}:00 (${duration}時間)`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="新規予約申請">
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid gap-2">
                    <Label htmlFor="purpose">利用目的</Label>
                    <Input
                        id="purpose"
                        placeholder="例: チーム定例、来客対応"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="participants">参加人数</Label>
                    <Input
                        id="participants"
                        type="number"
                        min="1"
                        value={participants}
                        onChange={(e) => setParticipants(e.target.value)}
                        required
                    />
                </div>

                {/* External Visitors Section */}
                <div className="border-t pt-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="hasExternalVisitors"
                            checked={hasExternalVisitors}
                            onChange={(e) => setHasExternalVisitors(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="hasExternalVisitors" className="cursor-pointer font-normal">
                            CoE職員以外の来訪者がいる
                        </Label>
                    </div>

                    {hasExternalVisitors && (
                        <div className="space-y-3 pl-6 border-l-2 border-primary/20">
                            <div className="grid gap-2">
                                <Label htmlFor="companyName">会社名</Label>
                                <Input
                                    id="companyName"
                                    placeholder="例: ○○株式会社"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required={hasExternalVisitors}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="visitorNames">来訪者氏名</Label>
                                <Input
                                    id="visitorNames"
                                    placeholder="例: 山田太郎、佐藤花子"
                                    value={visitorNames}
                                    onChange={(e) => setVisitorNames(e.target.value)}
                                    required={hasExternalVisitors}
                                />
                                <p className="text-xs text-muted-foreground">
                                    複数名の場合は「、」で区切ってください
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose}>キャンセル</Button>
                    <Button type="submit">申請する</Button>
                </div>
            </form>
        </Modal>
    );
}
