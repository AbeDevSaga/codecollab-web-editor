// File System Helpers
export function getLanguageFromFile(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "jsx":
      return "javascript";
    case "tsx":
      return "typescript";
    case "html":
      return "html";
    case "css":
      return "css";
    case "json":
      return "json";
    case "md":
      return "markdown";
    default:
      return "plaintext";
  }
}
export function getIconAndColorFromFile(filename: string): string[] {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
      return ["js", "text-yellow-500"];
    case "ts":
      return ["ts", "text-blue-500"];
    case "jsx":
      return ["jsx", "text-yellow-500"];
    case "tsx":
      return ["tsx", "text-blue-500"];
    case "html":
      return ["html", "text-orange-500"];
    case "css":
      return ["css", "text-blue-500"];
    case "json":
      return ["json", "text-green-500"];
    case "md":
      return ["md", "text-green-500"];
    case "txt":
      return ["txt", "text-gray-500"];
    case "png":
      return ["png", "text-pink-500"];
    case "jpg":
      return ["jpg", "text-pink-500"];
    case "jpeg":
      return ["jpeg", "text-pink-500"];
    case "gif":
      return ["gif", "text-pink-500"];
    case "svg":
      return ["svg", "text-pink-500"];
    case "pdf":
      return ["pdf", "text-red-500"];
    case "php":
      return ["php", "text-purple-500"];
    case "py":
      return ["py", "text-yellow-500"];
    case "java":
      return ["java", "text-red-500"];
    case "c":
      return ["c", "text-blue-500"];
    case "cpp":
      return ["cpp", "text-blue-500"];
    case "cs":
      return ["cs", "text-blue-500"];
    case "go":
      return ["go", "text-blue-500"];
    case "rb":
      return ["rb", "text-red-500"];
    case "swift":
      return ["swift", "text-orange-500"];
    case "kotlin":
      return ["kotlin", "text-purple-500"];
    case "r":
      return ["r", "text-green-500"];
    default:
      return ["txt", "text-gray-500"];
  }
}