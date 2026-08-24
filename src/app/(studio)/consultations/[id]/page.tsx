import ConsultationDetailView from "@/components/consultation/ConsultationDetailView";

export function generateStaticParams() {
  return [
    { id: "proj-1" },
    { id: "proj-2" },
    { id: "proj-3" },
    { id: "demo" },
  ];
}

export default async function ConsultationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ConsultationDetailView id={resolvedParams.id} />;
}
