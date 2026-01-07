"use client";

import { MOCK_USERS } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { ApplicantDashboard } from "@/components/features/applicant-dashboard";
import { ApproverDashboard } from "@/components/features/approver-dashboard";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/types";
import { Suspense, useEffect, useState } from "react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const found = MOCK_USERS.find(u => u.id === userId);
      if (found) {
        setUser(found);
      } else {
        // Invalid user ID
        router.replace('/');
      }
    } else {
      // No user ID
      router.replace('/');
    }
    setLoading(false);
  }, [userId, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // Will redirect

  return (
    <div className="min-h-screen bg-muted/10">
      <Header user={user} />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <RoleBasedView user={user} />
      </main>
    </div>
  );
}

// Wrap in Suspense because useSearchParams causes de-opt
export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function RoleBasedView({ user }: { user: User }) {
  switch (user.role) {
    case 'applicant':
      return <ApplicantDashboard user={user} />;
    case 'approver':
      return <ApproverDashboard user={user} />;
    case 'admin':
    case 'observer':
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">{user.role.toUpperCase()} Dashboard</h2>
            <p className="text-muted-foreground">
              このロールのダッシュボードは現在準備中です。（承認者ビューを表示します）
            </p>
          </div>
          <ApproverDashboard user={user} />
        </div>
      );
    default:
      return <div>Unknown role</div>;
  }
}
