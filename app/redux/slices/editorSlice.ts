import { TFile } from "@/app/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  terminalOpen: boolean;
  terminalHeight: number;
  activePanel: string | null;
  sidebarWidth: number;
  currentWorkspace: string | null;
  workspaces: {
    [userId: string]: {
      openFiles: TFile[]; // entire file structure
      activeFile: string | null; // path of the active file
      expandedFolders: string[]; // array of expanded folder paths
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
    initializeWorkspace: (
      state,
      action: PayloadAction<{
        workspaceId: string; // MongoDB _id
        userId: string;
      }>
    ) => {
      const { workspaceId, userId } = action.payload;
      state.currentWorkspace = workspaceId;

      if (!state.workspaces[userId]) {
        state.workspaces[userId] = {
          openFiles: [],
          activeFile: null,
          expandedFolders: [],
        };
      }
    },
    openFile: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        file: TFile;
      }>
    ) => {
      const { workspaceId, file } = action.payload;
      const workspace = state.workspaces[workspaceId];

      console.log("Processing openFile:", {
        workspaceId: action.payload.workspaceId,
        filePath: action.payload.file.path,
        existingWorkspace: !!workspace,
      });
      if (!workspace) return;

      // Check if file is already open
      const existingFileIndex = workspace.openFiles.findIndex(
        (f) => f.path === file.path
      );

      if (existingFileIndex === -1) {
        workspace.openFiles.push({
          ...file,
          isActive: true,
          isDirty: false,
        });
      } else {
        // Update the existing file
        workspace.openFiles[existingFileIndex] = {
          ...workspace.openFiles[existingFileIndex],
          isActive: true,
          isDirty: false,
        };
      }
      // Set all other files as inactive
      workspace.openFiles.forEach((f) => {
        f.isActive = f.path === file.path;
      });

      workspace.activeFile = file.path;
    },
    closeFile: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        filePath: string;
      }>
    ) => {
      const { workspaceId, filePath } = action.payload;
      const workspace = state.workspaces[workspaceId];

      if (!workspace) return;

      workspace.openFiles = workspace.openFiles.filter(
        (f) => f.path !== filePath
      );

      if (workspace.activeFile === filePath) {
        workspace.activeFile = workspace.openFiles[0]?.path || null;
        if (workspace.openFiles.length > 0) {
          workspace.openFiles[0].isActive = true;
        }
      }
    },
    saveWorkspaceState: (
      state,
      action: PayloadAction<{
        workspaceId: string;
      }>
    ) => {
      const { workspaceId } = action.payload;
      if (state.workspaces[workspaceId]) {
        localStorage.setItem(
          `workspace-${workspaceId}`,
          JSON.stringify(state.workspaces[workspaceId])
        );
      }
    },
    loadWorkspaceState: (
      state,
      action: PayloadAction<{
        workspaceId: string;
      }>
    ) => {
      const { workspaceId } = action.payload;
      const savedState = localStorage.getItem(`workspace-${workspaceId}`);

      if (savedState) {
        state.workspaces[workspaceId] = JSON.parse(savedState);
        state.currentWorkspace = workspaceId;
      }
    },
    updateFileContent: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        filePath: string;
        content: string;
        isDirty?: boolean;
      }>
    ) => {
      const { workspaceId, filePath, content, isDirty } = action.payload;
      const workspace = state.workspaces[workspaceId];

      if (workspace) {
        const file = workspace.openFiles.find((f) => f.path === filePath);
        if (file) {
          file.content = content;
          file.isDirty = isDirty ?? true;
        }
      }
    },
    toggleFolderExpand: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        folderPath: string;
      }>
    ) => {
      const { workspaceId, folderPath } = action.payload;
      const workspace = state.workspaces[workspaceId];

      if (workspace) {
        const index = workspace.expandedFolders.indexOf(folderPath);
        if (index === -1) {
          workspace.expandedFolders.push(folderPath);
        } else {
          workspace.expandedFolders.splice(index, 1);
        }
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
  updateFileContent,
  openFile,
  closeFile,
  saveWorkspaceState,
  loadWorkspaceState,
  toggleFolderExpand,
} = editorSlice.actions;

export default editorSlice.reducer;
