"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_USERS } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { ExternalIntegration } from "@/components/features/external-integration";
import { User } from "@/types";

function IntegrationContent() {
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
                <ExternalIntegration user={user} />
            </main>
        </div>
    );
}

export default function IntegrationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <IntegrationContent />
        </Suspense>
    );
}
