import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon, MoreVertical, StarIcon, TrashIcon, Undo2Icon } from "lucide-react";

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

import { useState } from "react";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "@/hooks/use-toast";
import StarFullIcon from "@/Icons/StarFullIcon";
import { Protect } from "@clerk/nextjs";
import { Doc } from "../../../../convex/_generated/dataModel";

export function FileCardActions({
  file,
  isFavourited,
}: {
  file: Doc<"files"> & { url?: string | null };
  isFavourited: boolean;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFavourite = useMutation(api.files.toggleFavorite);
  const restoreFile = useMutation(api.files.restoreFile);
  const me = useQuery(api.users.getMe);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {!file.shouldDelete ? (
            <div>
              <DropdownMenuItem
                onClick={() => {
                  toggleFavourite({
                    fileId: file._id,
                  });
                }}
                className="flex gap-1 items-center cursor-pointer">
                {isFavourited ? (
                  <div className="flex gap-1 text-yellow-600 items-center">
                    <StarFullIcon /> Unfavourite
                  </div>
                ) : (
                  <div className="flex gap-1 text-yellow-600 items-center">
                    <StarIcon /> Favourite
                  </div>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </div>
          ) : (
            <></>
          )}

          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === me?._id
              );
            }}
            fallback={<></>}>
            <DropdownMenuItem
              onClick={() => {
                if (file.shouldDelete) {
                  restoreFile({
                    fileId: file._id,
                  });
                } else {
                  setIsConfirmOpen(true);
                }
              }}
              className="flex gap-1 items-center cursor-pointer">
              {file.shouldDelete ? (
                <div className="flex gap-1 text-green-800 items-center">
                  <Undo2Icon className="w-4 h-4" /> Restore
                </div>
              ) : (
                <div className="flex gap-1 text-red-400 items-center">
                  <TrashIcon />
                  Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (file.url) {
                window.open(file.url, "_blank");
              }
            }}>
            <div className="flex gap-1 items-center text-gray-400">
              <DownloadIcon /> Download
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. Files are deleted
              Periodically
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteFile({ fileId: file._id });
                toast({
                  variant: "default",
                  title: "File marked for Deletion",
                  description: `${file.name} will be deleted soon`,
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
