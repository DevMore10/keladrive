"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import { FileDown, GridIcon, RowsIcon } from "lucide-react";
import { useState } from "react";
import UploadButton from "@/app/dashboard/components_/UploadButton";
import { api } from "../../../../convex/_generated/api";
import { SearchBar } from "@/app/dashboard/components_/SearchBar";
import { FileCard } from "@/app/dashboard/components_/FileCard";
import { FileTable } from "./FileTable";
import { columns } from "./Columns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

function Placeholder() {
  return (
    <>
      <div className="flex flex-col gap-5 items-center my-20">
        <Image
          alt="Image for No Files"
          src="/empty.svg"
          height={400}
          width={400}
        />
        <div className="text-2xl font-mono">Archivo No Encontrado</div>
      </div>
    </>
  );
}

export default function FileBrowser({
  title,
  favouritesOnly,
  deletedOnly,
}: {
  title: string;
  favouritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favourites = useQuery(api.files.getAllFavorites, orgId ? { orgId } : "skip");
  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          query,
          favourites: favouritesOnly,
          deletedOnly,
          type: type === "all" ? undefined : type,
        }
      : "skip"
  );
  const isLoading = files === undefined;

  return (
    <div className="mb-10">
      <div className="w-full">
        {/* {isLoading && (
          <div className="flex flex-col gap-5 items-center mt-28 text-slate-300">
            <FileDown className=" w-48 h-48 animate-pulse" />
            <div className="text-2xl">Loading ...</div>
          </div>
        )} */}

        {/* {!isLoading && !query && files.length === 0 && <Placeholder />}

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
        )} */}

        <div>
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold">{title}</h1>
            <SearchBar
              query={query}
              setQuery={setQuery}
            />
            <UploadButton />
          </div>

          <Tabs defaultValue="grid">
            <div className="flex justify-between">
              <TabsList>
                <TabsTrigger
                  value="grid"
                  className="gap-1">
                  <GridIcon /> Grid
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="gap-1">
                  <RowsIcon /> Table
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="type-select"
                  className="cursor-pointer">
                  Type Filter
                </Label>
                <Select
                  value={type}
                  onValueChange={(newType) => {
                    setType(newType as any);
                  }}>
                  <SelectTrigger
                    id="type-select"
                    className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading && (
              <div className="flex flex-col gap-5 items-center mt-28 text-slate-300">
                <FileDown className=" w-48 h-48 animate-pulse" />
                <div className="text-2xl">Loading your Files...</div>
              </div>
            )}

            <TabsContent value="grid">
              <div className="flex flex-col md:grid grid-cols-3 gap-5">
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
            </TabsContent>
            <TabsContent value="table">
              {" "}
              <FileTable
                columns={columns}
                data={files ?? []}
              />
            </TabsContent>
          </Tabs>

          {files?.length === 0 && <Placeholder />}
        </div>
      </div>
    </div>
  );
}
