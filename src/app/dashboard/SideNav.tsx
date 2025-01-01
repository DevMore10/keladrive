"use client";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideNav = () => {
  const pathName = usePathname();
  console.log(pathName);
  return (
    <div className="w-40 flex flex-col gap-2 ">
      <Link href="/dashboard/files">
        <Button
          variant={"link"}
          className={clsx("", {
            "text-blue-400": pathName.includes("/dashboard/files"),
          })}>
          <FileIcon />
          All Files
        </Button>
      </Link>
      <Link href="/dashboard/favourites">
        <Button
          variant={"link"}
          className={clsx("", {
            "text-blue-400": pathName.includes("/dashboard/favourites"),
          })}>
          <StarIcon />
          Favourites
        </Button>
      </Link>
      <Link href="/dashboard/trash">
        <Button
          variant={"link"}
          className={clsx("", {
            "text-blue-400": pathName.includes("/dashboard/trash"),
          })}>
          <Trash2Icon />
          Trash
        </Button>
      </Link>
    </div>
  );
};

export default SideNav;
