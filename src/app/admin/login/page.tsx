"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/libs/supabase";
import { useState } from "react";

export default function Page() {
  const [view, setView] = useState<any>("sign_in");

  const getTitle = (view: any) => {
    switch (view) {
      case "sign_in":
        return "Đăng nhập";
      case "sign_up":
        return "Đăng ký";
      case "forgotten_password":
        return "Quên mật khẩu";
      case "update_password":
        return "Cập nhật mật khẩu";
      default:
        return "Xác thực";
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm bg-white p-5 rounded-2xl text-black">
        <h1 className="text-2xl font-bold text-center mb-5">
          {getTitle(view)}
        </h1>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={["github"]}
          socialLayout="horizontal"
          redirectTo="/admin"
          view={view}
          showLinks={false} // Tắt nút mặc định như "Don't have an account? Sign up"
        />

        <div className="text-center mt-4 text-sm">
          {view === "sign_in" && (
            <>
              <button
                className="text-blue-600 underline"
                onClick={() => setView("forgotten_password")}
              >
                Quên mật khẩu?
              </button>
              <p className="mt-2">
                Chưa có tài khoản?{" "}
                <button
                  className="text-blue-600 underline"
                  onClick={() => setView("sign_up")}
                >
                  Đăng ký
                </button>
              </p>
            </>
          )}

          {view === "sign_up" && (
            <p>
              Đã có tài khoản?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setView("sign_in")}
              >
                Đăng nhập
              </button>
            </p>
          )}

          {view === "forgotten_password" && (
            <p>
              Nhớ mật khẩu rồi?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setView("sign_in")}
              >
                Quay lại đăng nhập
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
