"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "../../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileCardActions } from "./FileCardActions";
import { fileTypes } from "../../../../convex/schema";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Doc<"files">>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "Uploaded By",
    cell: ({ row }) => {
      const UserProfile = useQuery(api.users.getUserProfile, { userId: row.original.userId });
      return (
        <div className="flex gap-1 items-center text-sm">
          <Avatar>
            <AvatarImage
              src={UserProfile?.image}
              className="object-cover"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>{UserProfile?.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "Uploaded on ",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("_creationTime"));
      return (
        <div className="">{formatRelative(new Date(row.original._creationTime), new Date())}</div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const favourites = useQuery(
        api.files.getAllFavorites,
        row.original.orgId ? { orgId: row.original.orgId } : "skip"
      );

      const isFavourited = favourites?.some((favourite) => favourite.fileId === row.original._id);

      return (
        <>
          <FileCardActions
            file={row.original}
            isFavourited={isFavourited ?? false}
          />
        </>
      );
    },
  },
];
