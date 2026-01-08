import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "@/types";

interface HeaderProps {
    user: User;
}

export function Header({ user }: HeaderProps) {
    const roleNames: Record<string, string> = {
        applicant: "申請者",
        approver: "承認者",
        admin: "管理者",
        observer: "閲覧者"
    };

    return (
        <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* 左側: タイトル */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
                        <h1 className="text-lg font-bold text-gray-900 tracking-tight">C区画予約ポータル</h1>
                    </Link>
                </div>

                {/* 右側: ユーザー情報 */}
                <div className="flex items-center gap-4">
                    <div className="text-sm hidden sm:block">
                        <span className="font-medium text-gray-800">{user.name}</span>
                        <span className="text-gray-500 ml-2">({roleNames[user.role] || user.role})</span>
                    </div>
                    <Link href="/">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-700 border-gray-300 hover:bg-gray-50"
                        >
                            ログアウト
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
