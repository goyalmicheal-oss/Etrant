import Header from "@/components/header";
import Sidebar from "@/components/bar/side-bar";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <main className=" min-h-screen bg-gray-950 text-white">
      <Header />
      <section className="min-h-screen flex w-full">
        <Sidebar />
        <section className="flex w-full justify-center">{children}</section>
      </section>
    </main>
  );
}
