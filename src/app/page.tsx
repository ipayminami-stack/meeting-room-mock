"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Home() {
  const roles = [
    { id: '1', name: '叶 太郎', role: 'Applicant', desc: 'CoE職員 / 申請者' },
    { id: '7', name: '叶 次郎', role: 'Applicant', desc: '叶会会員 / 申請者' },
    { id: '2', name: '吉田 課長', role: 'Approver', desc: '承認者' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-muted/20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">会議室予約システム (Mock)</h1>
        <p className="text-muted-foreground">ログインするロールを選択してください</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {roles.map((role) => (
          <Link key={role.id} href={`/dashboard?userId=${role.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer aspect-square flex flex-col">
              <CardHeader className="flex-1 flex flex-col justify-center">
                <CardTitle className="text-center">{role.name}</CardTitle>
                <CardDescription className="text-center">{role.desc}</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <Button className="w-full">ログイン</Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
