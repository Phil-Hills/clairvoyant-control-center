import type { LogEntry } from "@/components/logs/logs-view"

// Helper function to create a date in the past
const pastDate = (minutesAgo: number) => {
  const date = new Date()
  date.setMinutes(date.getMinutes() - minutesAgo)
  return date
}

// Mock log data
export const mockLogs: LogEntry[] = [
  {
    id: "log-001",
    timestamp: pastDate(2),
    agentId: "agent-1",
    agentName: "Data Processor",
    severity: "info",
    message: "Task started: Processing data from gs://data-bucket/incoming/file1.json",
    source: "cloud-function",
    taskId: "task-1a2b3c",
    metadata: {
      functionName: "data-processor-function",
      region: "us-central1",
      executionId: "abcdef123456",
      memoryUsage: "128MB",
    },
    tags: ["data-processing", "startup"],
  },
  {
    id: "log-002",
    timestamp: pastDate(5),
    agentId: "agent-2",
    agentName: "Content Analyzer",
    severity: "info",
    message: "Successfully analyzed content with sentiment score: 0.8 (positive)",
    source: "vertex-ai",
    taskId: "task-2d3e4f",
    metadata: {
      model: "text-bison@001",
      inputTokens: 256,
      outputTokens: 128,
      processingTime: "1.2s",
    },
    tags: ["nlp", "sentiment-analysis"],
  },
  {
    id: "log-003",
    timestamp: pastDate(10),
    agentId: "agent-3",
    agentName: "Notification Service",
    severity: "error",
    message: "Failed to send notification: Connection timeout when connecting to SMTP server smtp.example.com:587",
    source: "cloud-function",
    taskId: "task-3f4g5h",
    metadata: {
      errorCode: "ETIMEDOUT",
      recipients: ["user@example.com", "admin@example.com"],
      retryCount: 3,
      maxRetries: 5,
    },
    tags: ["notification", "error", "timeout"],
  },
  {
    id: "log-004",
    timestamp: pastDate(15),
    agentId: "agent-4",
    agentName: "Log Analyzer",
    severity: "warning",
    message: "Rate limit reached when accessing log storage. Backing off for 30 seconds.",
    source: "cloud-function",
    taskId: "task-4h5i6j",
    metadata: {
      rateLimitQuota: "1000 requests per minute",
      currentUsage: "950 requests",
      backoffStrategy: "exponential",
      nextRetryIn: "30s",
    },
    tags: ["rate-limit", "backoff"],
  },
  {
    id: "log-005",
    timestamp: pastDate(20),
    agentId: "agent-5",
    agentName: "Sentiment Analyzer",
    severity: "info",
    message: "Processed 100 customer reviews with average sentiment score: 0.65",
    source: "vertex-ai",
    metadata: {
      batchId: "batch-20230411-001",
      processingTime: "45.2s",
      positiveReviews: 72,
      negativeReviews: 28,
    },
    tags: ["batch-processing", "sentiment"],
  },
  {
    id: "log-006",
    timestamp: pastDate(25),
    agentId: "agent-1",
    agentName: "Data Processor",
    severity: "info",
    message: "Data transformation complete. Converted 1.2GB of JSON to Parquet format.",
    source: "cloud-function",
    taskId: "task-5i6j7k",
    metadata: {
      inputSize: "1.2GB",
      outputSize: "450MB",
      compressionRatio: "62.5%",
      recordsProcessed: 1250000,
    },
    tags: ["data-transformation", "completion"],
  },
  {
    id: "log-007",
    timestamp: pastDate(30),
    agentId: "agent-2",
    agentName: "Content Analyzer",
    severity: "critical",
    message: "Service account permissions insufficient to access Cloud Storage bucket gs://restricted-data/",
    source: "cloud-function",
    metadata: {
      serviceAccount: "content-analyzer@project-id.iam.gserviceaccount.com",
      requiredPermission: "storage.objects.get",
      resourceType: "bucket",
      resourceName: "gs://restricted-data/",
    },
    tags: ["permission-error", "critical"],
  },
  {
    id: "log-008",
    timestamp: pastDate(35),
    agentId: "agent-3",
    agentName: "Notification Service",
    severity: "info",
    message: "Scheduled notification job started. Preparing to send 250 emails.",
    source: "scheduler",
    metadata: {
      jobId: "daily-digest-job",
      schedule: "0 8 * * *",
      recipientCount: 250,
      templateId: "daily-digest-template",
    },
    tags: ["scheduled-job", "email"],
  },
  {
    id: "log-009",
    timestamp: pastDate(40),
    agentId: "agent-4",
    agentName: "Log Analyzer",
    severity: "warning",
    message: "Found 15 ERROR level logs in application logs from the last hour.",
    source: "cloud-function",
    metadata: {
      timeRange: "last 1 hour",
      totalLogsScanned: 12500,
      errorCount: 15,
      warningCount: 42,
      topErrorPattern: "Connection refused",
    },
    tags: ["log-analysis", "error-detection"],
  },
  {
    id: "log-010",
    timestamp: pastDate(45),
    agentId: "agent-5",
    agentName: "Sentiment Analyzer",
    severity: "error",
    message: "Failed to parse input JSON: Unexpected token at line 27, column 15",
    source: "pubsub",
    taskId: "task-6j7k8l",
    metadata: {
      messageId: "12345678901234",
      publishTime: "2023-04-11T10:15:30.123Z",
      subscription: "projects/my-project/subscriptions/sentiment-analysis-sub",
      errorLocation: { line: 27, column: 15 },
    },
    tags: ["json-parsing", "error"],
  },
  {
    id: "log-011",
    timestamp: pastDate(50),
    agentId: "agent-1",
    agentName: "Data Processor",
    severity: "info",
    message: "Pub/Sub message received. Starting data processing job.",
    source: "pubsub",
    metadata: {
      messageId: "23456789012345",
      publishTime: "2023-04-11T10:10:30.123Z",
      subscription: "projects/my-project/subscriptions/data-processing-sub",
      dataSize: "25MB",
    },
    tags: ["pubsub", "job-start"],
  },
  {
    id: "log-012",
    timestamp: pastDate(55),
    agentId: "agent-2",
    agentName: "Content Analyzer",
    severity: "info",
    message: "Entity extraction complete. Found 27 named entities in document.",
    source: "vertex-ai",
    taskId: "task-7k8l9m",
    metadata: {
      model: "text-bison@001",
      documentId: "doc-12345",
      entityTypes: {
        PERSON: 8,
        LOCATION: 12,
        ORGANIZATION: 5,
        DATE: 2,
      },
      processingTime: "2.3s",
    },
    tags: ["nlp", "entity-extraction"],
  },
  {
    id: "log-013",
    timestamp: pastDate(60),
    agentId: "agent-3",
    agentName: "Notification Service",
    severity: "warning",
    message: "Email delivery delayed. SMTP server responding slowly.",
    source: "cloud-function",
    taskId: "task-8l9m0n",
    metadata: {
      smtpServer: "smtp.example.com",
      responseTime: "4.5s",
      threshold: "2.0s",
      queuedEmails: 15,
    },
    tags: ["email", "performance", "warning"],
  },
  {
    id: "log-014",
    timestamp: pastDate(65),
    agentId: "agent-4",
    agentName: "Log Analyzer",
    severity: "info",
    message: "Daily log analysis report generated and saved to gs://reports-bucket/daily/2023-04-11.pdf",
    source: "scheduler",
    metadata: {
      reportSize: "1.2MB",
      pageCount: 15,
      logsAnalyzed: 125000,
      generationTime: "45s",
    },
    tags: ["report", "scheduled"],
  },
  {
    id: "log-015",
    timestamp: pastDate(70),
    agentId: "agent-5",
    agentName: "Sentiment Analyzer",
    severity: "critical",
    message: "Vertex AI quota exceeded. Service unavailable for sentiment analysis operations.",
    source: "vertex-ai",
    metadata: {
      quotaName: "VertexAI-PredictRequests",
      limit: "1000 requests per minute",
      resetTime: "2023-04-11T12:00:00Z",
      errorCode: "RESOURCE_EXHAUSTED",
    },
    tags: ["quota", "critical", "service-unavailable"],
  },
]
