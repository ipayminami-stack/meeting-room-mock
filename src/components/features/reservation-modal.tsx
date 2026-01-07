"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Room } from "@/types";
import { Plus, X } from "lucide-react";

interface Participant {
    name: string;
    email: string;
    company?: string;
    isExternal: boolean;
}

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        purpose: string;
        participants: number;
        startTime: Date;
        endTime: Date;
        participantList?: {
            name: string;
            email: string;
            company?: string;
        }[];
    }) => void;
    selectedRoom?: Room;
    selectedTime?: string; // ISO string
}

export function ReservationModal({ isOpen, onClose, onSubmit, selectedRoom, selectedTime }: ReservationModalProps) {
    const [purpose, setPurpose] = useState("");
    const [roomName, setRoomName] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([
        { name: "", email: "", isExternal: false }
    ]);

    const [startHour, setStartHour] = useState(10);
    const [endHour, setEndHour] = useState(11);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const minHour = 10;
    const maxHour = 18;

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
        setParticipants([{ name: "", email: "", isExternal: false }]);
    }, [selectedRoom, selectedTime, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const start = new Date(selectedDate);
        start.setHours(startHour, 0, 0, 0);

        const end = new Date(selectedDate);
        end.setHours(endHour, 0, 0, 0);

        const participantList = participants
            .filter(p => p.name && p.email)
            .map(p => ({
                name: p.name,
                email: p.email,
                ...(p.isExternal && p.company && { company: p.company })
            }));

        const data = {
            purpose,
            participants: participantList.length,
            startTime: start,
            endTime: end,
            ...(participantList.length > 0 && { participantList })
        };

        onSubmit(data);
        onClose();
    };

    const addParticipant = () => {
        setParticipants([...participants, { name: "", email: "", isExternal: false }]);
    };

    const removeParticipant = (index: number) => {
        if (participants.length > 1) {
            setParticipants(participants.filter((_, i) => i !== index));
        }
    };

    const updateParticipant = (index: number, field: keyof Participant, value: string | boolean) => {
        const updated = [...participants];
        updated[index] = { ...updated[index], [field]: value };
        setParticipants(updated);
    };

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

                {/* Participant List */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>参加者リスト</Label>
                        <Button type="button" size="sm" variant="outline" onClick={addParticipant}>
                            <Plus className="h-4 w-4 mr-1" />
                            参加者を追加
                        </Button>
                    </div>

                    <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                        {participants.map((participant, index) => (
                            <div key={index} className="border rounded-lg p-3 space-y-3 relative">
                                {participants.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6"
                                        onClick={() => removeParticipant(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}

                                <div className="text-sm font-medium text-muted-foreground">
                                    参加者 {index + 1}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor={`name-${index}`}>氏名</Label>
                                    <Input
                                        id={`name-${index}`}
                                        placeholder="例: 山田太郎"
                                        value={participant.name}
                                        onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor={`email-${index}`}>メールアドレス</Label>
                                    <Input
                                        id={`email-${index}`}
                                        type="email"
                                        placeholder="例: yamada@example.com"
                                        value={participant.email}
                                        onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        QRコードを送信します
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`external-${index}`}
                                        checked={participant.isExternal}
                                        onChange={(e) => updateParticipant(index, 'isExternal', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor={`external-${index}`} className="cursor-pointer font-normal">
                                        外部来訪者
                                    </Label>
                                </div>

                                {participant.isExternal && (
                                    <div className="grid gap-2 pl-6 border-l-2 border-primary/20">
                                        <Label htmlFor={`company-${index}`}>会社名</Label>
                                        <Input
                                            id={`company-${index}`}
                                            placeholder="例: ○○株式会社"
                                            value={participant.company || ''}
                                            onChange={(e) => updateParticipant(index, 'company', e.target.value)}
                                            required={participant.isExternal}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onClose}>キャンセル</Button>
                    <Button type="submit">申請する</Button>
                </div>
            </form>
        </Modal>
    );
}
