"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, Shield, ClipboardList } from "lucide-react";
import { MOCK_USERS } from "@/lib/data";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/20">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex-col lg:flex mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-center mb-4">会議室予約システム (Mock)</h1>
        <p className="text-muted-foreground text-center text-lg">デモ用のユーザーを選択してログインしてください</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {MOCK_USERS.map((user) => {
          let Icon = Users;
          let description = "一般社員向け";
          if (user.role === 'approver') { Icon = UserCheck; description = "承認者・管理者向け"; }
          if (user.role === 'observer') { Icon = ClipboardList; description = "状況確認・監査向け"; }
          if (user.role === 'admin') { Icon = Shield; description = "システム管理"; }

          return (
            <Link key={user.id} href={`/dashboard?userId=${user.id}`} className="transition-transform hover:scale-105">
              <Card className="h-full hover:border-primary cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.department}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-balance leading-relaxed text-muted-foreground mb-4">
                    <strong>{user.role.toUpperCase()}</strong><br />
                    {description}
                  </p>
                  <Button className="w-full">ログイン</Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
