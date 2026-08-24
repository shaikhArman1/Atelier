import ProjectDetailView from "@/components/projects/ProjectDetailView";

export function generateStaticParams() {
  return [
    { id: "proj-1" },
    { id: "proj-2" },
    { id: "proj-3" },
    { id: "demo" },
  ];
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ProjectDetailView projectId={resolvedParams.id} />;
}
