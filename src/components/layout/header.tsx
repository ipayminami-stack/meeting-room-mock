import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { LogOut } from "lucide-react";

interface HeaderProps {
    user: User;
}

export function Header({ user }: HeaderProps) {
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="font-bold text-lg flex items-center gap-2">
                        <span className="text-primary">■</span> 会議室予約
                    </Link>
                    <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground ml-4">
                        <Link href="/dashboard" className="transition-colors hover:text-foreground">ホーム</Link>
                        {/* Add more links if needed */}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-right hidden md:block">
                        <div className="font-medium leading-none">{user.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{user.department}</div>
                    </div>
                    <Link href="/">
                        <Button variant="ghost" size="icon" title="ログアウト">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
