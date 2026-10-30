# Architecture diagram sources

These diagrams were created from the source code of RenewGrid and CallMissed, not guessed.

- AWS architecture service icons: July 2026 official AWS icon set mirrored in https://github.com/phergoualch/aws-icons (origin: https://aws.amazon.com/architecture/icons/).
- Development tooling logos: https://github.com/devicons/devicon.

RenewGrid references: compose.yaml, Jenkinsfile, terraform/main.tf, GitHub workflows.
CallMissed references: docs/ARCHITECTURE.md, CI/deploy workflows, infrastructure/terraform.

RenewGrid's Terraform uses the Docker provider, not Terraform-managed AWS infrastructure. CallMissed's browser voice audio connects to provider WebRTC directly; Lambda participates in session establishment, not media transport. The Function URL has AWS auth NONE and uses a reviewer access gate within the application.

The SVG sources are editable vector graphics. PNGs are optimized for the portfolio gallery and both formats are ready to copy into src/assets/project-media/.
