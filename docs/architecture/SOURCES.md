# Architecture diagram sources

These diagrams were created from the source code of RenewGrid and CallMissed, not guessed.

- AWS architecture service icons: July 2026 official AWS icon set mirrored in https://github.com/phergoualch/aws-icons (origin: https://aws.amazon.com/architecture/icons/).
- Development tooling logos: https://github.com/devicons/devicon.

RenewGrid references: compose.yaml, Jenkinsfile, terraform/main.tf, GitHub workflows.
CallMissed references: docs/ARCHITECTURE.md, CI/deploy workflows, infrastructure/terraform.

RenewGrid's Terraform uses the Docker provider, not Terraform-managed AWS infrastructure. CallMissed's browser voice audio connects to provider WebRTC directly; Lambda participates in session establishment, not media transport. The Function URL has AWS auth NONE and uses a reviewer access gate within the application.

The SVG sources are editable vector graphics. PNGs are optimized for the portfolio gallery and both formats are ready to copy into src/assets/project-media/.

## AssembleMonitor

The portfolio uses three source-backed architecture diagrams:

| Diagram | Portfolio asset | Main configuration references |
| :--- | :--- | :--- |
| AWS deployment | assemblemonitor-aws.png | terraform/vpc.tf, terraform/eks.tf, terraform/alb_asg.tf, terraform/rds.tf, Helm application configuration |
| CI/CD and GitOps | assemblemonitor-gitops.png | .github/workflows/pr-validation.yml, Jenkinsfile-gitops, Jenkinsfile-k3s, k8s/argocd-application.yaml |
| Observability | assemblemonitor-observability.png | k8s/helm-chart/values/observability.yaml, k8s/helm-chart/templates/otel-external-scraper.yaml, Grafana and observability backend configuration |

Source repository: https://github.com/Aoun62336/AssembleMonitor-DevOps

### Interpretation boundaries

- AWS infrastructure reuses the account's default VPC.
- The EKS managed node group runs in private subnets.
- The legacy application Auto Scaling Group is configured with zero desired capacity.
- The Jenkins EKS GitOps and alternate K3s deployment paths are separate.
- Jenkins publishes images before manual approval and commits the approved Helm image reference to Git.
- Argo CD reconciles the primary EKS deployment.
- OpenTelemetry exports logs to Loki, traces to Tempo, and metrics to Amazon Managed Prometheus.
- Loki and Tempo use Amazon S3 for object storage.
- The external EC2 Node Exporter metrics are scraped through a separate OpenTelemetry deployment.
- The diagrams describe the checked-in architecture and do not establish continuous availability of cloud resources.

The authoritative portfolio image exports are kept in
src/assets/project-media/. Their implementation relationships
must remain consistent with the referenced configuration files.
