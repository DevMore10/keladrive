"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UploadButton from "@/app/components_/UploadButton";
import { api } from "../../../convex/_generated/api";
import { SearchBar } from "@/app/components_/SearchBar";
import { FileCard } from "@/app/components_/FileCard";

function Placeholder() {
  return (
    <>
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
    </>
  );
}

export default function FilesPage({
  title,
  favouritesOnly,
}: {
  title: string;
  favouritesOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favourites = useQuery(api.files.getAllFavorites, orgId ? { orgId } : "skip");
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favourites: favouritesOnly } : "skip"
  );
  const isLoading = files === undefined;

  return (
    <div>
      <div className="w-full">
        {isLoading && (
          <div className="flex flex-col gap-5 items-center mt-28 text-slate-300">
            <FileDown className=" w-48 h-48 animate-pulse" />
            <div className="text-2xl">Loading ...</div>
          </div>
        )}

        {!isLoading && !query && files.length === 0 && <Placeholder />}

        {!isLoading && query && files.length === 0 && (
          <>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-bold">Your Files</h1>
              <SearchBar
                query={query}
                setQuery={setQuery}
              />
              <UploadButton />
            </div>
            <div className="flex flex-col gap-5 items-center mt-20">
              <Image
                alt="Image for No Files"
                src="/empty.svg"
                height={400}
                width={400}
              />
              <div className="text-2xl font-mono">Archivo No Encontrado</div>
              <UploadButton />
            </div>
          </>
        )}

        {!isLoading && files.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-bold">{title}</h1>
              <SearchBar
                query={query}
                setQuery={setQuery}
              />
              <UploadButton />
            </div>

            <div className="grid grid-cols-3 gap-5">
              {files?.map((file) => {
                return (
                  <FileCard
                    key={file._id}
                    file={file}
                    favourites={favourites ?? []}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
