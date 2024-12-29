import React from "react";
import FileBrowser from "@/app/components_/FileBrowser";
import { useQuery } from "convex/react";

const page = () => {
  return (
    <>
      <FileBrowser title={"Your Files"} />
    </>
  );
};

export default page;
