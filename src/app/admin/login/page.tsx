"use client";
import { login } from "@/actions/auth";
import { Card, CardTitle } from "@/components/ui-shadcn/card";
import { Button } from "@/components/ui-shadcn/button";
import { Input } from "@/components/ui-shadcn/input";
import { Label } from "@/components/ui-shadcn/label";

import toast from "react-hot-toast";
import { useEffect, useActionState } from "react";

export default function LoginPage() {
  const [state, formActions] = useActionState(login, { success: false });
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm p-6">
        <CardTitle className="text-center">
          <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
        </CardTitle>

        <form action={formActions} className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              className="h-10"
              id="email"
              name="email"
              type="email"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              className="h-10"
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          <Button type="submit" className="w-full py-5">
            Đăng nhập
          </Button>
        </form>
      </Card>
    </div>
  );
}
