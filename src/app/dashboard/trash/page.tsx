import React from "react";
import FileBrowser from "../components_/FileBrowser";

function Trash() {
  return (
    <>
      <FileBrowser
        title={"Deleted Files"}
        deletedOnly
      />
    </>
  );
}

export default Trash;
