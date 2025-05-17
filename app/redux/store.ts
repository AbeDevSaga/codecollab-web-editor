import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./slices/editorSlice";
import themeReducer from "./slices/themeSlice";
import tokenReducer from "./slices/tokenSlice";
import fileReducer from "./slices/fileSlice";
import chatGroupReducer from "./slices/chatGroupSlice";
import projectReducer from "./slices/projectSlice";

const store = configureStore({
  reducer: {
    editor: editorReducer,
    file: fileReducer,
    chatGroup: chatGroupReducer,
    project:projectReducer,
    theme: themeReducer,
    token: tokenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignore redux-persist actions
      },
    }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export const persistor = persistStore(store); 
export default store;