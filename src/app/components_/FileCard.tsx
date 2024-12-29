import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  StarIcon,
  TrashIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import StarFullIcon from "@/Icons/StarFullIcon";
import { Protect } from "@clerk/nextjs";

function FileCardActions({ file, isFavourited }: { file: Doc<"files">; isFavourited: boolean }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFavourite = useMutation(api.files.toggleFavorite);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              toggleFavourite({
                fileId: file._id,
              });
            }}
            className="flex gap-1 items-center cursor-pointer text-blue-800">
            {isFavourited ? (
              <div className="flex gap-2">
                <StarFullIcon /> Unfavourite
              </div>
            ) : (
              <div className="flex gap-2">
                <StarIcon /> Favourite
              </div>
            )}
          </DropdownMenuItem>

          <Protect
            role="org:admin"
            fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setIsConfirmOpen(true);
              }}
              className="flex gap-1 items-center cursor-pointer text-red-700">
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteFile({ fileId: file._id });
                toast({
                  variant: "default",
                  title: "File Deleted",
                  description: `${file.name} is now gone from the System`,
                });
              }}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function FileCard({
  file,
  favourites,
}: {
  file: Doc<"files"> & { url?: string | null };
  favourites: Doc<"favourites">[];
}) {
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
      <CardContent className="flex h-[300px] justify-center items-center">
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
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            if (file.url) {
              window.open(file.url, "_blank");
            }
          }}>
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
