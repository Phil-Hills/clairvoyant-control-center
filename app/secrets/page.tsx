import { SecretsHeader } from "@/components/secrets/secrets-header"
import { SecretsTable } from "@/components/secrets/secrets-table"

export default function SecretsManagerPage() {
  return (
    <div className="flex flex-col gap-6">
      <SecretsHeader />
      <SecretsTable />
    </div>
  )
}
