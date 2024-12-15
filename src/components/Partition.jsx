
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { splitPartition, removePartition, resizePartition } from "../store/partitionSlice";

const Partition = ({ id }) => {
  const dispatch = useDispatch();
  const partition = useSelector((state) =>
    state.partitions.find((p) => p.id === id)
  );

  const [localSize, setLocalSize] = useState(partition.size);
  const resizeRef = useRef(null);

  if (!partition) return null;

  const handleSplit = (direction) => {
    dispatch(splitPartition({ id, direction }));
  };

  const handleRemove = () => {
    dispatch(removePartition(id));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialSize = localSize;

    const handleMouseMove = (event) => {
      let delta;

      if (partition.orientation === "h") {
        delta = event.clientX - startX; 
      } else {
        delta = event.clientY - startY; 
      }

      const newSize = Math.max(20, initialSize + delta / 5);
      setLocalSize(newSize);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      dispatch(resizePartition({ id, newSize: localSize }));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={resizeRef}
      className="relative flex border-2 border-black w-full h-full text-3xl"
      style={{
        backgroundColor: partition.color,
        flex: localSize,
        flexDirection: partition.orientation === "h" ? "row" : "column",
      }}
    >
      {partition.children.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center space-x-2">
          <button
            className="px-2 bg-gray-300 border border-gray-500 rounded-lg"
            onClick={() => handleSplit("h")}
          >
            H
          </button>
          <button
            className="px-2 bg-gray-300 border border-gray-500 rounded-lg"
            onClick={() => handleSplit("v")}
          >
            V
          </button>
          {partition.parentId !== null && (
            <button
              className="px-2 bg-gray-300 border border-gray-500 rounded-lg"
              onClick={handleRemove}
            >
              -
            </button>
          )}
        </div>
      ) : (
        partition.children.map((childId) => (
          <Partition key={childId} id={childId} />
        ))
      )}

      {/* Resize Handle */}
      {partition.parentId && (
        <div
          onMouseDown={handleMouseDown}
          className={`absolute ${
            partition.orientation === "h"
              ? "right-0 top-0 bottom-0 w-2 cursor-col-resize"
              : "bottom-0 left-0 right-0 h-2 cursor-row-resize"
          } bg-gray-400`}
        ></div>
      )}
    </div>
  );
};

export default Partition;
