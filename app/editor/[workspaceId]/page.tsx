import EditorAuthWrapper from "@/app/EditorAuthWrapper";
import EditorPage from "@/app/page";

export default function WorkspaceEditorPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  return (
    <EditorAuthWrapper>
      <EditorPage />
    </EditorAuthWrapper>
  );
}

