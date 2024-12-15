import { configureStore } from "@reduxjs/toolkit";
import partitionReducer from "./partitionSlice";

const store = configureStore({
  reducer: {
    partitions: partitionReducer,
  },
});

export default store;
