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
    onSubmit: (data: { purpose: string; participants: number }) => void;
    selectedRoom?: Room;
    selectedTime?: string; // ISO string
}

export function ReservationModal({ isOpen, onClose, onSubmit, selectedRoom, selectedTime }: ReservationModalProps) {
    const [purpose, setPurpose] = useState("");
    const [participants, setParticipants] = useState("1");
    const [roomName, setRoomName] = useState("");

    // Update form when props change
    useEffect(() => {
        if (selectedRoom) setRoomName(selectedRoom.name);
        setPurpose("");
        setParticipants("1");
    }, [selectedRoom, selectedTime, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            purpose,
            participants: parseInt(participants)
        });
        onClose();
    };

    const formattedDate = selectedTime ? new Date(selectedTime).toLocaleString('ja-JP', {
        dateStyle: 'medium', timeStyle: 'short'
    }) : "";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="新規予約申請">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                    <Label>会議室</Label>
                    <Input value={roomName} disabled className="bg-muted" />
                </div>

                <div className="grid gap-2">
                    <Label>日時</Label>
                    <Input value={formattedDate} disabled className="bg-muted" />
                </div>

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

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose}>キャンセル</Button>
                    <Button type="submit">申請する</Button>
                </div>
            </form>
        </Modal>
    );
}
