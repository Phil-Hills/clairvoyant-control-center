import { NextResponse } from "next/server"

// Sample response data structure
interface AgentResponse {
  message: string
  action?: "blueprint" | "logs" | "info"
  data?: any
}

export async function POST(request: Request) {
  try {
    const { command, notificationTopic, projectId } = await request.json()

    // Access the environment variables
    const topicName = notificationTopic || process.env.NOTIFICATION_TOPIC || "not-configured"
    const PROJECT_ID = projectId || process.env.PROJECT_ID || "your-project-id"

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simple command pattern matching for demo
    let response: AgentResponse

    if (command.toLowerCase().includes("project") && command.toLowerCase().includes("info")) {
      // Return project info
      response = {
        message: `Here's the information about your GCP project:`,
        action: "info",
        data: {
          projectId: PROJECT_ID,
          name: "Clairvoyant Project",
          createdAt: "2023-01-15T10:30:00Z",
          status: "ACTIVE",
          billingEnabled: true,
          resources: {
            cloudFunctions: 5,
            pubsubTopics: 8,
            secretManager: 12,
            cloudScheduler: 3,
            vertexAI: 2,
          },
          defaultRegion: "us-central1",
          notificationTopic: topicName,
        },
      }
    } else if (command.toLowerCase().includes("deploy") || command.toLowerCase().includes("create")) {
      // Return a blueprint action
      response = {
        message: `I've analyzed your request and created a blueprint for a Cloud Function that processes images and sends notifications. This will be deployed to project: ${PROJECT_ID}. Here's the proposed configuration:`,
        action: "blueprint",
        data: {
          name: "image-processor",
          type: "cloudFunction",
          runtime: "nodejs16",
          region: "us-central1",
          entryPoint: "processImage",
          environmentVariables: {
            GCP_PROJECT: PROJECT_ID,
            NOTIFICATION_TOPIC: topicName,
          },
          eventTrigger: {
            eventType: "google.storage.object.finalize",
            resource: `projects/${PROJECT_ID}/buckets/my-images-bucket`,
          },
          iamPermissions: ["roles/cloudfunctions.invoker", "roles/pubsub.publisher"],
          sourceCode: {
            files: {
              "index.js": `const functions = require('@google-cloud/functions-framework');
const {PubSub} = require('@google-cloud/pubsub');

// Function for project: ${PROJECT_ID}
functions.cloudEvent('processImage', async (cloudEvent) => {
  console.log('Processing file:', cloudEvent.data.name);
  
  // Process the image
  // ...
  
  // Send notification to topic: ${topicName}
  const pubsub = new PubSub();
  const topic = pubsub.topic(process.env.NOTIFICATION_TOPIC);
  await topic.publish(Buffer.from(JSON.stringify({
    filename: cloudEvent.data.name,
    bucket: cloudEvent.data.bucket,
    processedAt: new Date().toISOString(),
    projectId: '${PROJECT_ID}'
  })));
});`,
              "package.json":
                '{\n  "dependencies": {\n    "@google-cloud/functions-framework": "^3.1.0",\n    "@google-cloud/pubsub": "^3.0.0"\n  }\n}',
            },
          },
        },
      }
    } else if (command.toLowerCase().includes("notification") || command.toLowerCase().includes("topic")) {
      // Return info about the notification topic
      response = {
        message: `I'm currently configured to use the notification topic: ${topicName} in project ${PROJECT_ID}. This topic is used for system-wide notifications and agent communication.`,
        action: "info",
        data: {
          topicName: topicName,
          projectId: PROJECT_ID,
          fullPath: `projects/${PROJECT_ID}/topics/${topicName}`,
          status: "active",
          messageRetentionDuration: "7d",
          schemaSettings: {
            encoding: "JSON",
          },
          labels: {
            environment: "production",
            managed_by: "clairvoyant",
          },
        },
      }
    } else if (command.toLowerCase().includes("logs") || command.toLowerCase().includes("error")) {
      // Return logs
      response = {
        message: `I've found the most recent logs for your services in project ${PROJECT_ID}. There are a few errors in the HealthChecker function that you should look at:`,
        action: "logs",
        data: {
          projectId: PROJECT_ID,
          logs: [
            {
              timestamp: "2023-05-10T15:42:18.123Z",
              severity: "ERROR",
              service: "health-checker",
              message: "Failed to connect to API endpoint: https://api.example.com/status - timeout after 5000ms",
              projectId: PROJECT_ID,
            },
            {
              timestamp: "2023-05-10T15:40:12.654Z",
              severity: "INFO",
              service: "health-checker",
              message: "Checking 5 endpoints",
              projectId: PROJECT_ID,
            },
            {
              timestamp: "2023-05-10T15:38:45.332Z",
              severity: "INFO",
              service: "image-processor",
              message: `Successfully processed image and published to ${topicName}`,
              projectId: PROJECT_ID,
            },
          ],
        },
      }
    } else if (command.toLowerCase().includes("resources") || command.toLowerCase().includes("list")) {
      // Return GCP resources
      response = {
        message: `Here are the current resources in your GCP project ${PROJECT_ID}:`,
        action: "info",
        data: {
          projectId: PROJECT_ID,
          resources: {
            cloudFunctions: [
              {
                name: "image-processor",
                status: "ACTIVE",
                region: "us-central1",
                runtime: "nodejs16",
                lastInvoked: "2023-05-10T14:32:18Z",
              },
              {
                name: "health-checker",
                status: "ACTIVE",
                region: "us-central1",
                runtime: "nodejs16",
                lastInvoked: "2023-05-10T15:42:18Z",
              },
              {
                name: "data-analyzer",
                status: "ACTIVE",
                region: "us-east1",
                runtime: "python39",
                lastInvoked: "2023-05-10T12:15:45Z",
              },
            ],
            pubsubTopics: [
              {
                name: topicName,
                messageRetentionDuration: "7d",
                status: "ACTIVE",
              },
              {
                name: "data-processed",
                messageRetentionDuration: "7d",
                status: "ACTIVE",
              },
            ],
            secretManager: [
              {
                name: "api-keys",
                versions: 3,
                lastAccessed: "2023-05-10T15:40:12Z",
              },
              {
                name: "database-credentials",
                versions: 2,
                lastAccessed: "2023-05-10T12:15:45Z",
              },
            ],
          },
        },
      }
    } else {
      // Default informational response
      response = {
        message: `I'm your AI assistant for the Clairvoyant Control Center. I'm connected to project: ${PROJECT_ID} and notification topic: ${topicName}.\n\nI can help you with:\n\n- Deploy cloud functions, pub/sub topics, or other GCP resources\n- Monitor your existing infrastructure\n- Debug issues with your services\n- Analyze and optimize your cloud architecture\n\nTry asking something like 'Create a cloud function for processing images', 'Show me the logs for my health checker', or 'Show me project info'.`,
        action: "info",
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error processing agent command:", error)
    return NextResponse.json({ error: "Failed to process your command" }, { status: 500 })
  }
}
