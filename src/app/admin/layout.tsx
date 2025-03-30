"usr client";
import NavBarAdmin from "@/components/layout/navbar-admin";
import { ThemeProvider } from "@/provider/theme-provider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBarAdmin></NavBarAdmin>

      <div className="mx-2 sm:mx-20">{children}</div>
    </div>
  );
}
