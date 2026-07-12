import type { Project } from "@/lib/content";

const fileHints: Record<string, { name: string; size: string }[]> = {
  Docker: [{ name: "Dockerfile", size: "1.2 KB" }],
  "Docker Compose": [{ name: "docker-compose.yml", size: "2.0 KB" }],
  Terraform: [{ name: "terraform/main.tf", size: "4.8 KB" }],
  "GitHub Actions": [{ name: ".github/workflows/deploy.yml", size: "2.1 KB" }],
  Kafka: [{ name: "kafka/topics.yaml", size: "0.9 KB" }],
  React: [{ name: "src/App.tsx", size: "3.4 KB" }],
  LangChain: [{ name: "agents/root_cause_agent.py", size: "6.7 KB" }],
  ArgoCD: [{ name: "argocd/application.yaml", size: "1.5 KB" }],
  "Socket.IO": [{ name: "server/socket.ts", size: "2.3 KB" }],
  FastAPI: [{ name: "main.py", size: "5.2 KB" }],
  Redis: [{ name: "redis/config.conf", size: "0.6 KB" }],
  YOLOv8: [{ name: "models/yolov8n.pt", size: "6.2 MB" }],
  "AWS ECS": [{ name: "ecs/task-definition.json", size: "1.8 KB" }],
  DynamoDB: [{ name: "infra/dynamodb-tables.tf", size: "2.4 KB" }],
  SQS: [{ name: "workers/notification-worker.ts", size: "3.1 KB" }],
  "AWS EKS": [{ name: "helm/kubevigil/Chart.yaml", size: "0.7 KB" }],
  "AWS CloudWatch": [{ name: "monitoring/dashboards.json", size: "5.5 KB" }],
  Grafana: [{ name: "grafana/dashboards/overview.json", size: "8.3 KB" }],
  PostgreSQL: [{ name: "db/schema.sql", size: "3.9 KB" }],
  "Sarvam AI": [{ name: "speech/stt_client.py", size: "2.2 KB" }],
  ChromaDB: [{ name: "retrieval/vector_store.py", size: "1.9 KB" }],
  WebRTC: [{ name: "streaming/webrtc_broker.py", size: "4.1 KB" }],
  FFmpeg: [{ name: "scripts/ffmpeg_pipeline.sh", size: "1.1 KB" }],
};

export function fakeObjects(project: Project) {
  const objects = [{ name: "README.md", size: "4.3 KB" }];
  for (const tech of project.stack) {
    const hit = fileHints[tech];
    if (hit) objects.push(...hit);
  }
  return objects.slice(0, 7);
}
