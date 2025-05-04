import { FileItem } from "./type";

export const fileTreeData: FileItem[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    path: "/src",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        path: "/src/components",
        children: [
          {
            id: "3",
            name: "Button.tsx",
            type: "file",
            path: "/src/components/Button.tsx",
            extension: "tsx",
          },
          {
            id: "4",
            name: "Card.tsx",
            type: "file",
            path: "/src/components/Card.tsx",
            extension: "tsx",
          },
        ],
      },
      {
        id: "5",
        name: "pages",
        type: "folder",
        path: "/src/pages",
        children: [
          {
            id: "6",
            name: "index.tsx",
            type: "file",
            path: "/src/pages/index.tsx",
            extension: "tsx",
          },
        ],
      },
      {
        id: "7",
        name: "styles.css",
        type: "file",
        path: "/src/styles.css",
        extension: "css",
      },
    ],
  },
  {
    id: "8",
    name: "public",
    type: "folder",
    path: "/public",
    children: [
      {
        id: "9",
        name: "images",
        type: "folder",
        path: "/public/images",
        children: [],
      },
    ],
  },
  {
    id: "10",
    name: "package.json",
    type: "file",
    path: "/package.json",
    extension: "json",
  },
  {
    id: "11",
    name: "README.md",
    type: "file",
    path: "/README.md",
    extension: "md",
  },
];
