"use client";

import PersonNode from "./PersonNode";

const TreeView = ({ tree }: any) => {
  if (!tree) return <div>No Data</div>;

  return (
    <div
      style={{
        position: "relative",
        padding: 20,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <PersonNode person={tree} />
    </div>
  );
};

export default TreeView;
