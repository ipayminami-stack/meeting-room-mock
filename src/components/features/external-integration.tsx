"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Calendar, Check, X, ExternalLink } from "lucide-react";

interface ExternalIntegrationProps {
    user: any;
}

// サンプル来訪予約データ
const SAMPLE_VISITOR_RESERVATIONS = [
    {
        id: "v-001",
        visitorName: "山田太郎",
        company: "株式会社ABC",
        email: "yamada@abc.co.jp",
        visitDate: "2026-01-10",
        visitTime: "10:00",
        purpose: "商談",
        host: "叶 太郎",
        qrCode: "QR-ABC-001-20260110",
        status: "confirmed"
    },
    {
        id: "v-002",
        visitorName: "佐藤花子",
        company: "XYZ株式会社",
        email: "sato@xyz.co.jp",
        visitDate: "2026-01-10",
        visitTime: "14:00",
        purpose: "打ち合わせ",
        host: "叶 次郎",
        qrCode: "QR-XYZ-002-20260110",
        status: "confirmed"
    },
    {
        id: "v-003",
        visitorName: "鈴木一郎",
        company: "テクノロジー株式会社",
        email: "suzuki@tech.co.jp",
        visitDate: "2026-01-11",
        visitTime: "11:00",
        purpose: "システム導入相談",
        host: "吉田 課長",
        qrCode: "QR-TECH-003-20260111",
        status: "pending"
    }
];

export function ExternalIntegration({ user }: ExternalIntegrationProps) {
    const [qrSystemUrl, setQrSystemUrl] = useState("https://qr-system.example.com/api");
    const [googleCalendarUrl, setGoogleCalendarUrl] = useState("https://calendar.google.com/calendar/api");
    const [qrConnected, setQrConnected] = useState(false);
    const [calendarConnected, setCalendarConnected] = useState(false);

    const handleQrConnect = () => {
        // 実際の接続処理はここに実装
        setQrConnected(true);
        alert("QRシステムに接続しました");
    };

    const handleCalendarConnect = () => {
        // 実際の接続処理はここに実装
        setCalendarConnected(true);
        alert("Googleカレンダーに接続しました");
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">外部システム連携</h2>
                <p className="text-muted-foreground">QRシステムとGoogleカレンダーとの連携設定</p>
            </div>

            <Tabs defaultValue="qr" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="qr">
                        <QrCode className="h-4 w-4 mr-2" />
                        QRシステム連携
                    </TabsTrigger>
                    <TabsTrigger value="calendar">
                        <Calendar className="h-4 w-4 mr-2" />
                        Googleカレンダー連携
                    </TabsTrigger>
                </TabsList>

                {/* QRシステム連携タブ */}
                <TabsContent value="qr" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>QRシステム接続設定</CardTitle>
                            <CardDescription>
                                外部QRシステムとの連携設定を行います
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="qr-url">QRシステムURL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="qr-url"
                                        type="url"
                                        value={qrSystemUrl}
                                        onChange={(e) => setQrSystemUrl(e.target.value)}
                                        placeholder="https://qr-system.example.com/api"
                                    />
                                    <Button onClick={handleQrConnect} className="whitespace-nowrap">
                                        {qrConnected ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2" />
                                                接続済み
                                            </>
                                        ) : (
                                            <>
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                接続
                                            </>
                                        )}
                                    </Button>
                                </div>
                                {qrConnected && (
                                    <p className="text-sm text-green-600">✓ QRシステムに接続されています</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 来訪予約一覧 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>来訪予約一覧</CardTitle>
                            <CardDescription>
                                QRシステムから取得した来訪予約データ（サンプル）
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {SAMPLE_VISITOR_RESERVATIONS.map((visitor) => (
                                    <div
                                        key={visitor.id}
                                        className="border rounded-lg p-4 space-y-3"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold">{visitor.visitorName}</h4>
                                                    <Badge variant={visitor.status === 'confirmed' ? 'default' : 'secondary'}>
                                                        {visitor.status === 'confirmed' ? '確認済み' : '保留中'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{visitor.company}</p>
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className="font-medium">{visitor.visitDate}</p>
                                                <p className="text-muted-foreground">{visitor.visitTime}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">訪問目的</p>
                                                <p className="font-medium">{visitor.purpose}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">担当者</p>
                                                <p className="font-medium">{visitor.host}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t">
                                            <QrCode className="h-4 w-4 text-muted-foreground" />
                                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                                {visitor.qrCode}
                                            </code>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Googleカレンダー連携タブ */}
                <TabsContent value="calendar" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Googleカレンダー接続設定</CardTitle>
                            <CardDescription>
                                Googleカレンダーとの連携設定を行います
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="calendar-url">Googleカレンダー API URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="calendar-url"
                                        type="url"
                                        value={googleCalendarUrl}
                                        onChange={(e) => setGoogleCalendarUrl(e.target.value)}
                                        placeholder="https://calendar.google.com/calendar/api"
                                    />
                                    <Button onClick={handleCalendarConnect} className="whitespace-nowrap">
                                        {calendarConnected ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2" />
                                                接続済み
                                            </>
                                        ) : (
                                            <>
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                接続
                                            </>
                                        )}
                                    </Button>
                                </div>
                                {calendarConnected && (
                                    <p className="text-sm text-green-600">✓ Googleカレンダーに接続されています</p>
                                )}
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">連携機能</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• 承認済み予約を自動的にGoogleカレンダーに追加</li>
                                    <li>• 予約の変更をカレンダーに反映</li>
                                    <li>• 予約のキャンセルをカレンダーから削除</li>
                                    <li>• 参加者への自動通知</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>同期設定</CardTitle>
                            <CardDescription>
                                カレンダー同期のオプション設定
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">自動同期</p>
                                    <p className="text-sm text-muted-foreground">承認時に自動的にカレンダーに追加</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    有効
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">通知送信</p>
                                    <p className="text-sm text-muted-foreground">参加者にカレンダー招待を送信</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    有効
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
