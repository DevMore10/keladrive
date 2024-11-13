"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import UploadButton from "./UploadButton";
import { FileCard } from "./FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto pt-12">
      {isLoading && (
        <div className="flex flex-col gap-5 items-center mt-28 text-slate-300">
          <Loader2 className=" w-48 h-48 animate-spin" />
          <div className="text-2xl">Loading ...</div>
        </div>
      )}

      {!isLoading && files.length === 0 && (
        <div className="flex flex-col gap-5 items-center mt-20">
          <Image
            alt="Image for No Files"
            src="/empty.svg"
            height={400}
            width={400}
          />
          <div className="text-2xl font-mono">You have no Files, Upload one now</div>
          <UploadButton />
        </div>
      )}

      {!isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadButton />
          </div>
          <div className="grid grid-cols-3 gap-5">
            {files?.map((file) => {
              return (
                <FileCard
                  key={file._id}
                  file={file}
                />
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
