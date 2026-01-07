"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Home() {
  const roles = [
    { id: '1', name: '叶 太郎', role: 'Applicant', desc: '一般社員 / 申請者' },
    { id: '2', name: '吉田 課長', role: 'Approver', desc: '承認者' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-muted/20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">会議室予約システム (Mock)</h1>
        <p className="text-muted-foreground">ログインするロールを選択してください</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {roles.map((role) => (
          <Link key={role.id} href={`/dashboard?userId=${role.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{role.name}</CardTitle>
                <CardDescription>{role.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">ログイン</Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
