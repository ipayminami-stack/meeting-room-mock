"use client";

import { useState } from "react";
import { Room } from "@/types";
import { MOCK_ROOMS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Plus, Edit, Trash2, MapPin, Users } from "lucide-react";

export function RoomManagement() {
    const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);

    // Form state
    const [roomName, setRoomName] = useState("");
    const [capacity, setCapacity] = useState("10");
    const [floor, setFloor] = useState("");
    const [facilities, setFacilities] = useState("");

    const resetForm = () => {
        setRoomName("");
        setCapacity("10");
        setFloor("");
        setFacilities("");
    };

    const handleAddRoom = (e: React.FormEvent) => {
        e.preventDefault();

        const newRoom: Room = {
            id: `room-${Date.now()}`,
            name: roomName,
            capacity: parseInt(capacity),
            facilities: facilities.split(',').map(f => f.trim()).filter(f => f),
            floor: floor || undefined
        };

        setRooms([...rooms, newRoom]);
        setIsAddModalOpen(false);
        resetForm();
    };

    const handleEditRoom = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRoom) return;

        const updatedRoom: Room = {
            ...selectedRoom,
            name: roomName,
            capacity: parseInt(capacity),
            facilities: facilities.split(',').map(f => f.trim()).filter(f => f),
            floor: floor || undefined
        };

        setRooms(rooms.map(r => r.id === selectedRoom.id ? updatedRoom : r));
        setIsEditModalOpen(false);
        resetForm();
        setSelectedRoom(undefined);
    };

    const handleDeleteRoom = () => {
        if (!selectedRoom) return;

        setRooms(rooms.filter(r => r.id !== selectedRoom.id));
        setIsDeleteModalOpen(false);
        setSelectedRoom(undefined);
    };

    const openEditModal = (room: Room) => {
        setSelectedRoom(room);
        setRoomName(room.name);
        setCapacity(room.capacity.toString());
        setFloor(room.floor || "");
        setFacilities(room.facilities.join(', '));
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (room: Room) => {
        setSelectedRoom(room);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">部屋管理</h2>
                    <p className="text-muted-foreground">会議室の追加・編集・削除</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    部屋を追加
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map(room => (
                    <Card key={room.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{room.name}</h3>
                                    {room.floor && (
                                        <p className="text-sm text-muted-foreground">{room.floor}</p>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => openEditModal(room)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => openDeleteModal(room)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center text-muted-foreground">
                                <Users className="mr-2 h-4 w-4" />
                                定員: {room.capacity}名
                            </div>
                            {room.facilities.length > 0 && (
                                <div className="flex items-start text-muted-foreground">
                                    <MapPin className="mr-2 h-4 w-4 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="font-medium text-xs mb-1">設備:</div>
                                        <div className="flex flex-wrap gap-1">
                                            {room.facilities.map((facility, idx) => (
                                                <span key={idx} className="text-xs bg-muted px-2 py-0.5 rounded">
                                                    {facility}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Room Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); resetForm(); }} title="部屋を追加">
                <form onSubmit={handleAddRoom} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="add-name">部屋名</Label>
                        <Input
                            id="add-name"
                            placeholder="例: 会議室D"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-capacity">定員</Label>
                        <Input
                            id="add-capacity"
                            type="number"
                            min="1"
                            placeholder="例: 10"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-floor">フロア（任意）</Label>
                        <Input
                            id="add-floor"
                            placeholder="例: 3F"
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-facilities">設備（カンマ区切り）</Label>
                        <Input
                            id="add-facilities"
                            placeholder="例: プロジェクター, ホワイトボード"
                            value={facilities}
                            onChange={(e) => setFacilities(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            複数の設備は「、」または「,」で区切ってください
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
                            キャンセル
                        </Button>
                        <Button type="submit">追加</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Room Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); setSelectedRoom(undefined); }} title="部屋を編集">
                <form onSubmit={handleEditRoom} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">部屋名</Label>
                        <Input
                            id="edit-name"
                            placeholder="例: 会議室D"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-capacity">定員</Label>
                        <Input
                            id="edit-capacity"
                            type="number"
                            min="1"
                            placeholder="例: 10"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-floor">フロア（任意）</Label>
                        <Input
                            id="edit-floor"
                            placeholder="例: 3F"
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-facilities">設備（カンマ区切り）</Label>
                        <Input
                            id="edit-facilities"
                            placeholder="例: プロジェクター, ホワイトボード"
                            value={facilities}
                            onChange={(e) => setFacilities(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            複数の設備は「、」または「,」で区切ってください
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => { setIsEditModalOpen(false); resetForm(); setSelectedRoom(undefined); }}>
                            キャンセル
                        </Button>
                        <Button type="submit">更新</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSelectedRoom(undefined); }} title="部屋を削除">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        本当に「{selectedRoom?.name}」を削除しますか？この操作は取り消せません。
                    </p>
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="ghost" onClick={() => { setIsDeleteModalOpen(false); setSelectedRoom(undefined); }}>
                            キャンセル
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteRoom}>
                            削除
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
