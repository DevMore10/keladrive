import FileBrowser from "@/app/components_/FileBrowser";

export default function FavouritePage() {
  return (
    <div>
      <FileBrowser
        title={"Favourites"}
        favourites
      />
    </div>
  );
}
