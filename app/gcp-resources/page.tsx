import { GcpResourceHeader } from "@/components/gcp-resources/gcp-resource-header"
import { VertexAISection } from "@/components/gcp-resources/vertex-ai-section"
import { CloudFunctionsSection } from "@/components/gcp-resources/cloud-functions-section"
import { PubSubSection } from "@/components/gcp-resources/pubsub-section"
import { SecretManagerSection } from "@/components/gcp-resources/secret-manager-section"
import { CloudSchedulerSection } from "@/components/gcp-resources/cloud-scheduler-section"

export default function GcpResourcesPage() {
  return (
    <div className="flex flex-col gap-6">
      <GcpResourceHeader />
      <div className="grid gap-6">
        <VertexAISection />
        <CloudFunctionsSection />
        <PubSubSection />
        <SecretManagerSection />
        <CloudSchedulerSection />
      </div>
    </div>
  )
}
