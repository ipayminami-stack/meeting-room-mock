"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const users = {
    "user01": { password: "user01", userId: "1", name: "叶 太郎" },
    "user02": { password: "user02", userId: "7", name: "叶 次郎" },
    "admin": { password: "admin", userId: "2", name: "吉田 課長" }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = users[username as keyof typeof users];

    if (user && user.password === password) {
      router.push(`/dashboard?userId=${user.userId}`);
    } else {
      setError("ユーザー名またはパスワードが正しくありません");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-muted/20 pt-32">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">C区画予約ポータル (Mock)</h1>
        <p className="text-muted-foreground">ログインしてください</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">ユーザー名</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
              />
            </div>
            {error && (
              <div className="text-sm text-destructive text-center">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">
              ログイン
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 flex gap-4 justify-center">
        <a
          href="/docs/manual_applicant.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          📖 申請者向けマニュアル
        </a>
        <span className="text-muted-foreground">|</span>
        <a
          href="/docs/manual_approver.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          📖 承認者向けマニュアル
        </a>
      </div>

      <div className="mt-8 text-sm text-muted-foreground text-center">
        <p className="mb-2">テストアカウント:</p>
        <div className="space-y-1">
          <p>user01 / user01 (叶 太郎)</p>
          <p>user02 / user02 (叶 次郎)</p>
          <p>admin / admin (吉田 課長)</p>
        </div>
      </div>
    </main>
  );
}
