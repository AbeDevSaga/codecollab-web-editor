import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./slices/editorSlice";
import themeReducer from "./slices/themeSlice";
import tokenReducer from "./slices/tokenSlice";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// Persist configuration
// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["token"], // Only persist the auth slice
// };

// const persistedAuthReducer = persistReducer(persistConfig, tokenReducer);

const store = configureStore({
  reducer: {
    editor: editorReducer,
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