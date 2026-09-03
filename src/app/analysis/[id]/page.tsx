import { AnalysisClient } from "@/components/analysis/analysis-client";

export default async function AnalysisPage({
  params,
}: PageProps<"/analysis/[id]">) {
  const { id } = await params;
  return <AnalysisClient runId={id} />;
}
