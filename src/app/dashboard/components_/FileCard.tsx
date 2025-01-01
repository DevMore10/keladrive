import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "../../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { FileCardActions } from "./FileCardActions";
import { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function FileCard({
  file,
  favourites,
}: {
  file: Doc<"files"> & { url?: string | null };
  favourites: Doc<"favourites">[];
}) {
  const UserProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  const isFavourited = favourites.some((favourite) => favourite.fileId === file._id);

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 font-mono">
          <div>{typeIcons[file.type]}</div>

          {file.name}
        </CardTitle>

        <div className="absolute top-3 right-3">
          <FileCardActions
            file={file}
            isFavourited={isFavourited}
          />
        </div>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent className=" flex h-[220px] justify-center items-center">
        {file.type === "image" && file.url && (
          <Image
            alt={file.name}
            height="200"
            width="200"
            src={file.url}
          />
        )}
        {file.type == "csv" && <GanttChartIcon className="h-32 w-32" />}
        {file.type == "pdf" && <FileTextIcon className="h-32 w-32" />}
      </CardContent>
      <CardFooter className="flex gap-2  font-sans">
        <Avatar>
          <AvatarImage
            src={UserProfile?.image}
            className="object-cover"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-xs ">
          <span className="text-base text-gray-700 ">{UserProfile?.name}</span>
          <span className="text-gray-400">
            {formatRelative(new Date(file._creationTime), new Date())}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
