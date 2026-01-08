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
                {/* 左側: ロゴとタイトル */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="text-blue-600 font-bold text-xl">IPA</div>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <h1 className="text-base font-semibold text-gray-800">会議室予約システム</h1>
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
