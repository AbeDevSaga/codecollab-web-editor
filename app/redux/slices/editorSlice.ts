import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  terminalOpen: boolean;
  terminalHeight: number;
  activePanel: string | null;
  sidebarWidth: number;
  currentWorkspace: string | null;
  workspaces: {
    [userId: string]: {
      openFiles: string[];
      activeFile: string | null;
      // Add other workspace-specific state here
    };
  };
}

const initialState: EditorState = {
  terminalOpen: false,
  terminalHeight: 200,
  activePanel: "files",
  sidebarWidth: 250,
  currentWorkspace: null,
  workspaces: {},
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setTerminalOpen: (state, action: PayloadAction<boolean>) => {
      state.terminalOpen = action.payload;
    },
    setTerminalHeight: (state, action: PayloadAction<number>) => {
      state.terminalHeight = action.payload;
    },
    setActivePanel: (state, action: PayloadAction<string | null>) => {
      state.activePanel = action.payload;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload;
    },
    initializeWorkspace: (state, action: PayloadAction<{
        workspaceId: string; // MongoDB _id
        userId: string;
      }>) => {
        const { workspaceId, userId } = action.payload;
        state.currentWorkspace = workspaceId;
        
        if (!state.workspaces[userId]) {
          state.workspaces[userId] = {
            openFiles: [],
            activeFile: null,
          };
        }
      },
    },
  });

export const {
  setTerminalOpen,
  setTerminalHeight,
  setActivePanel,
  setSidebarWidth,
  initializeWorkspace,
} = editorSlice.actions;

export default editorSlice.reducer;