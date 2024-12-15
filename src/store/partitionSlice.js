import { createSlice } from "@reduxjs/toolkit";

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const partitionSlice = createSlice({
  name: "partitions",
  initialState: [
    {
      id: 1,
      color: getRandomColor(),
      orientation: null,
      children: [],
      parentId: null,
      size: 100,
    },
  ],
  reducers: {
    splitPartition: (state, action) => {
      const { id, direction } = action.payload;
      const parent = state.find((p) => p.id === id);

      if (!parent || parent.children.length) return;

      const child1 = {
        id: state.length + 1,
        color: parent.color,
        orientation: null,
        children: [],
        parentId: id,
        size: 50,
      };
      const child2 = {
        id: state.length + 2,
        color: getRandomColor(),
        orientation: null,
        children: [],
        parentId: id,
        size: 50,
      };

      parent.orientation = direction;
      parent.children = [child1.id, child2.id];
      state.push(child1, child2);
    },

    removePartition: (state, action) => {
      const idToRemove = action.payload;
      const partition = state.find((p) => p.id === idToRemove);

      if (!partition || !partition.parentId) return;

      // Find parent and reset its children
      const parent = state.find((p) => p.id === partition.parentId);
      if (parent) {
        parent.children = [];
        parent.orientation = null;
      }

      // Remove the partition and its descendants
      const idsToRemove = [idToRemove];
      while (idsToRemove.length) {
        const currentId = idsToRemove.pop();
        state.forEach((p) => {
          if (p.parentId === currentId) idsToRemove.push(p.id);
        });
        const index = state.findIndex((p) => p.id === currentId);
        if (index !== -1) state.splice(index, 1);
      }
    },

    resizePartition: (state, action) => {
      const { id, newSize } = action.payload;
      const partition = state.find((p) => p.id === id);
      if (partition) partition.size = newSize;
    },
  },
});

export const { splitPartition, removePartition, resizePartition } = partitionSlice.actions;
export default partitionSlice.reducer;
