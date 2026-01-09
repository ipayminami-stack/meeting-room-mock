"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, AlertCircle, CheckCircle, XCircle, RefreshCw, Search, QrCode } from "lucide-react";

interface EmailHistoryProps {
    user: any;
}

// メール送信履歴のサンプルデータ
const SAMPLE_EMAIL_HISTORY = [
    {
        id: "email-001",
        type: "reservation_received",
        subject: "【C区画予約ポータル】予約申請を受け付けました",
        to: "kanoh.taro@example.com",
        recipients: ["kanoh.taro@example.com"],
        sentAt: "2026-01-08 10:30:00",
        status: "delivered",
        reservationId: "res-001",
        reservationDetails: "コラボレーションルーム / 2026-01-10 10:00-11:00"
    },
    {
        id: "email-002",
        type: "approved",
        subject: "【C区画予約ポータル】予約が承認されました（QRコード添付）",
        to: "kanoh.taro@example.com, yamada@abc.co.jp",
        recipients: ["kanoh.taro@example.com", "yamada@abc.co.jp"],
        sentAt: "2026-01-08 11:00:00",
        status: "delivered",
        reservationId: "res-001",
        reservationDetails: "コラボレーションルーム / 2026-01-10 10:00-11:00",
        qrCode: "QR-ABC-001-20260110",
        hasAttachment: true
    },
    {
        id: "email-003",
        type: "change_request_received",
        subject: "【C区画予約ポータル】変更申請を受け付けました",
        to: "kanoh.jiro@example.com",
        recipients: ["kanoh.jiro@example.com"],
        sentAt: "2026-01-08 14:00:00",
        status: "bounced",
        bounceReason: "Mailbox full",
        reservationId: "res-002",
        reservationDetails: "会議室（大） / 2026-01-11 14:00-16:00"
    },
    {
        id: "email-004",
        type: "approved",
        subject: "【C区画予約ポータル】予約が承認されました",
        to: "yoshida.manager@example.com",
        recipients: ["yoshida.manager@example.com"],
        sentAt: "2026-01-08 15:30:00",
        status: "delivered",
        reservationId: "res-003",
        reservationDetails: "会議室（小） / 2026-01-12 10:00-12:00"
    },
    {
        id: "email-005",
        type: "withdrawal",
        subject: "【C区画予約ポータル】予約申請が取り下げられました",
        to: "admin@example.com",
        recipients: ["admin@example.com"],
        sentAt: "2026-01-08 16:00:00",
        status: "delivered",
        reservationId: "res-004",
        reservationDetails: "コラボレーションルーム / 2026-01-13 13:00-14:00"
    },
    {
        id: "email-006",
        type: "cancellation",
        subject: "【C区画予約ポータル】予約がキャンセルされました",
        to: "kanoh.taro@example.com, sato@xyz.co.jp, suzuki@tech.co.jp",
        recipients: ["kanoh.taro@example.com", "sato@xyz.co.jp", "suzuki@tech.co.jp"],
        sentAt: "2026-01-09 09:00:00",
        status: "bounced",
        bounceReason: "Invalid recipient",
        reservationId: "res-005",
        reservationDetails: "会議室（大） / 2026-01-15 10:00-11:00"
    }
];

const EMAIL_TYPE_LABELS: Record<string, string> = {
    reservation_received: "予約申請受領",
    change_request_received: "変更申請受領",
    withdrawal: "申請取り下げ",
    cancellation: "予約取消",
    approved: "承認通知"
};

const EMAIL_STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    delivered: { label: "送信成功", variant: "default" },
    bounced: { label: "バウンス", variant: "destructive" },
    pending: { label: "送信中", variant: "secondary" }
};

export function EmailHistory({ user }: EmailHistoryProps) {
    const [emailHistory] = useState(SAMPLE_EMAIL_HISTORY);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEmail, setSelectedEmail] = useState<typeof SAMPLE_EMAIL_HISTORY[0] | null>(null);
    const [resendEmail, setResendEmail] = useState("");
    const [showResendModal, setShowResendModal] = useState(false);

    // 今月のフィルター
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    // 月でフィルタリング
    const monthFilteredHistory = emailHistory.filter(email =>
        email.sentAt.substring(0, 7) === selectedMonth
    );

    // 検索でフィルタリング
    const filteredHistory = monthFilteredHistory.filter(email =>
        email.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.reservationDetails.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        // 送信日時の降順（新しい順）
        return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
    });

    // 月の統計
    const monthStats = {
        delivered: monthFilteredHistory.filter(e => e.status === 'delivered').length,
        bounced: monthFilteredHistory.filter(e => e.status === 'bounced').length,
        total: monthFilteredHistory.length
    };

    const handleResend = (email: typeof SAMPLE_EMAIL_HISTORY[0]) => {
        setSelectedEmail(email);
        setResendEmail(email.to);
        setShowResendModal(true);
    };

    const handleResendSubmit = () => {
        if (!selectedEmail) return;
        alert(`${resendEmail} に再送しました`);
        setShowResendModal(false);
        setSelectedEmail(null);
        setResendEmail("");
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">メール送信履歴</h2>
                <p className="text-muted-foreground">予約システムから送信されたメールの履歴とステータス</p>
            </div>

            {/* 月間統計（コンパクト） */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label>表示月:</Label>
                            <Input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-40"
                            />
                        </div>
                        <div className="flex gap-6 text-sm">
                            <div className="text-center">
                                <p className="text-xl font-bold text-green-600">{monthStats.delivered}</p>
                                <p className="text-xs text-muted-foreground">送信成功</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-red-600">{monthStats.bounced}</p>
                                <p className="text-xs text-muted-foreground">バウンス</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-gray-600">{monthStats.total}</p>
                                <p className="text-xs text-muted-foreground">総送信数</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 検索バー */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="メールアドレス、件名、予約内容で検索..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* メール送信履歴一覧（テーブル形式） */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b">
                                <tr className="text-sm">
                                    <th className="text-left p-3 font-medium">送信日時</th>
                                    <th className="text-left p-3 font-medium">種別</th>
                                    <th className="text-left p-3 font-medium">宛先</th>
                                    <th className="text-left p-3 font-medium">予約内容</th>
                                    <th className="text-left p-3 font-medium">ステータス</th>
                                    <th className="text-left p-3 font-medium">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map((email) => (
                                    <tr
                                        key={email.id}
                                        className={`border-b hover:bg-muted/30 transition-colors ${email.status === 'bounced' ? 'bg-red-50/50' : ''
                                            }`}
                                    >
                                        <td className="p-3 text-sm whitespace-nowrap">
                                            {email.sentAt.substring(5, 16).replace(' ', '\n')}
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="outline" className="text-xs">
                                                {EMAIL_TYPE_LABELS[email.type]}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-sm">
                                            {email.recipients && email.recipients.length > 1 ? (
                                                <div className="max-w-[200px]" title={email.recipients.join(', ')}>
                                                    <span className="font-medium">{email.recipients.length}名</span>
                                                    <span className="text-muted-foreground text-xs ml-1">
                                                        ({email.recipients[0].split('@')[0]}他)
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="max-w-[200px] truncate" title={email.to}>
                                                    {email.to}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 text-sm">
                                            <div className="space-y-1">
                                                <div>{email.reservationDetails}</div>
                                                {email.qrCode && (
                                                    <div className="flex items-center gap-1 text-xs text-blue-600">
                                                        <QrCode className="h-3 w-3" />
                                                        <code className="bg-blue-50 px-1 rounded">{email.qrCode}</code>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="space-y-1">
                                                <Badge variant={EMAIL_STATUS_LABELS[email.status].variant} className="text-xs">
                                                    {email.status === 'delivered' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                    {email.status === 'bounced' && <XCircle className="h-3 w-3 mr-1" />}
                                                    {EMAIL_STATUS_LABELS[email.status].label}
                                                </Badge>
                                                {email.status === 'bounced' && email.bounceReason && (
                                                    <div className="text-xs text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {email.bounceReason}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            {email.status === 'bounced' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleResend(email)}
                                                    className="h-7 text-xs border-red-300 text-red-700 hover:bg-red-50"
                                                >
                                                    <RefreshCw className="h-3 w-3 mr-1" />
                                                    再送
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredHistory.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground">
                                検索条件に一致するメール履歴がありません
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 再送モーダル */}
            {showResendModal && selectedEmail && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle>メール再送</CardTitle>
                            <CardDescription>
                                新しいメールアドレスを入力して再送してください
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>元の宛先</Label>
                                <Input value={selectedEmail.to} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="resend-email">新しい宛先</Label>
                                <Input
                                    id="resend-email"
                                    type="email"
                                    value={resendEmail}
                                    onChange={(e) => setResendEmail(e.target.value)}
                                    placeholder="new-email@example.com"
                                />
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                                <p className="font-medium text-blue-900 mb-1">送信内容</p>
                                <p className="text-blue-800">{selectedEmail.subject}</p>
                                {selectedEmail.qrCode && (
                                    <p className="text-blue-800 mt-1">QRコード: {selectedEmail.qrCode}</p>
                                )}
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowResendModal(false);
                                        setSelectedEmail(null);
                                        setResendEmail("");
                                    }}
                                >
                                    キャンセル
                                </Button>
                                <Button onClick={handleResendSubmit} disabled={!resendEmail}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    再送する
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
