"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Room } from "@/types";
import { Plus, X, Upload, Download } from "lucide-react";

interface ExternalVisitor {
    company: string;
    name: string;
    email: string;
}

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        purpose: string;
        participants: number;
        startTime: Date;
        endTime: Date;
        externalVisitors?: ExternalVisitor[];
    }) => void;
    selectedRoom?: Room;
    selectedTime?: string; // ISO string
}

export function ReservationModal({ isOpen, onClose, onSubmit, selectedRoom, selectedTime }: ReservationModalProps) {
    const [purpose, setPurpose] = useState("");
    const [participants, setParticipants] = useState("1");
    const [roomName, setRoomName] = useState("");
    const [hasExternalVisitors, setHasExternalVisitors] = useState(false);
    const [externalVisitors, setExternalVisitors] = useState<ExternalVisitor[]>([
        { company: "", name: "", email: "" }
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
        setParticipants("1");
        setHasExternalVisitors(false);
        setExternalVisitors([{ company: "", name: "", email: "" }]);
    }, [selectedRoom, selectedTime, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const start = new Date(selectedDate);
        start.setHours(startHour, 0, 0, 0);

        const end = new Date(selectedDate);
        end.setHours(endHour, 0, 0, 0);

        const validVisitors = externalVisitors.filter(v => v.company && v.name && v.email);

        const data = {
            purpose,
            participants: parseInt(participants),
            startTime: start,
            endTime: end,
            ...(hasExternalVisitors && validVisitors.length > 0 && { externalVisitors: validVisitors })
        };

        onSubmit(data);
        onClose();
    };

    const addVisitor = () => {
        setExternalVisitors([...externalVisitors, { company: "", name: "", email: "" }]);
    };

    const removeVisitor = (index: number) => {
        if (externalVisitors.length > 1) {
            setExternalVisitors(externalVisitors.filter((_, i) => i !== index));
        }
    };

    const updateVisitor = (index: number, field: keyof ExternalVisitor, value: string) => {
        const updated = [...externalVisitors];
        updated[index] = { ...updated[index], [field]: value };
        setExternalVisitors(updated);
    };

    const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim());

            // ヘッダー行をスキップ
            const dataLines = lines.slice(1);

            const visitors: ExternalVisitor[] = dataLines.map(line => {
                const [company, name, email] = line.split(',').map(s => s.trim());
                return { company: company || '', name: name || '', email: email || '' };
            }).filter(v => v.company && v.name && v.email);

            if (visitors.length > 0) {
                setExternalVisitors(visitors);
                setHasExternalVisitors(true);
            }
        };
        reader.readAsText(file);

        // ファイル入力をリセット
        event.target.value = '';
    };

    const downloadCSVTemplate = () => {
        const template = '会社名,氏名,メールアドレス\n株式会社ABC,山田太郎,yamada@abc.co.jp\nXYZ株式会社,佐藤花子,sato@xyz.co.jp';
        const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = '来訪者テンプレート.csv';
        link.click();
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
                        <div className="space-y-4">
                            {/* CSV アップロード */}
                            <div className="border rounded-lg p-4 bg-blue-50/30">
                                <div className="flex items-center justify-between mb-3">
                                    <Label className="text-sm font-semibold">CSVファイルで一括登録</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={downloadCSVTemplate}
                                        className="h-8 text-xs"
                                    >
                                        <Download className="h-3 w-3 mr-1" />
                                        テンプレートDL
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleCSVUpload}
                                        className="flex-1"
                                        id="csv-upload"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById('csv-upload')?.click()}
                                        className="h-10"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        アップロード
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    形式: 会社名,氏名,メールアドレス（ヘッダー行含む）
                                </p>
                            </div>

                            {/* 手動入力 */}
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold">または手動で入力</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addVisitor}
                                    className="h-8"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    来訪者を追加
                                </Button>
                            </div>

                            <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                                {externalVisitors.map((visitor, index) => (
                                    <div key={index} className="border rounded-lg p-3 space-y-3 bg-blue-50/50 relative">
                                        {externalVisitors.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6"
                                                onClick={() => removeVisitor(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}

                                        <div className="text-sm font-medium text-muted-foreground">
                                            来訪者 {index + 1}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor={`company-${index}`}>会社名</Label>
                                            <Input
                                                id={`company-${index}`}
                                                placeholder="例: ○○株式会社"
                                                value={visitor.company}
                                                onChange={(e) => updateVisitor(index, 'company', e.target.value)}
                                                required={hasExternalVisitors}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor={`name-${index}`}>氏名</Label>
                                            <Input
                                                id={`name-${index}`}
                                                placeholder="例: 山田太郎"
                                                value={visitor.name}
                                                onChange={(e) => updateVisitor(index, 'name', e.target.value)}
                                                required={hasExternalVisitors}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor={`email-${index}`}>メールアドレス</Label>
                                            <Input
                                                id={`email-${index}`}
                                                type="email"
                                                placeholder="例: yamada@example.com"
                                                value={visitor.email}
                                                onChange={(e) => updateVisitor(index, 'email', e.target.value)}
                                                required={hasExternalVisitors}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                QRコードを送信します
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onClose}>キャンセル</Button>
                    <Button type="submit">申請する</Button>
                </div>
            </form>
        </Modal>
    );
}
