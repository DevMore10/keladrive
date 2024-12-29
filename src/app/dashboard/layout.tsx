import { Button } from "@/components/ui/button";
import { FileIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import SideNav from "./SideNav";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto pt-12">
      <div className="flex gap-10">
        <SideNav />
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
