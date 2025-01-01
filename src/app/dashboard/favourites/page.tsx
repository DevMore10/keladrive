import FileBrowser from "@/app/dashboard/components_/FileBrowser";

export default function FavouritePage() {
  return (
    <div>
      <FileBrowser
        title={"Favourites"}
        favouritesOnly
      />
    </div>
  );
}
