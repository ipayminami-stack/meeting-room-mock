"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_USERS } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { EmailHistory } from "@/components/features/email-history";
import { User } from "@/types";

function EmailHistoryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams?.get("userId");
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!userId) {
            router.push("/");
            return;
        }

        const foundUser = MOCK_USERS.find((u) => u.id === userId);
        if (!foundUser) {
            router.push("/");
            return;
        }

        // 承認者または管理者のみアクセス可能
        if (foundUser.role !== "approver" && foundUser.role !== "admin") {
            router.push("/dashboard?userId=" + userId);
            return;
        }

        setUser(foundUser);
    }, [userId, router]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} />
            <main className="container mx-auto px-4 py-8">
                <EmailHistory user={user} />
            </main>
        </div>
    );
}

export default function EmailHistoryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EmailHistoryContent />
        </Suspense>
    );
}
