"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export default function Home() {
  const roles = [
    { id: '1', name: '叶 太郎', role: 'Applicant', desc: '一般社員 / 申請者' },
    { id: '2', name: '吉田 課長', role: 'Approver', desc: '承認者' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/20">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">会議室予約システム (Mock)</h1>
        <p className="text-muted-foreground">ログインするロールを選択してください</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {roles.map((role) => (
          <Link key={role.id} href={`/dashboard?userId=${role.id}`} className="block group">
            <Card className="h-full transition-colors group-hover:bg-primary/5 cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                  <CardDescription>{role.desc}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
