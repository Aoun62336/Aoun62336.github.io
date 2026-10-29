---
title: "AssembleMonitor"
category: "AWS / KUBERNETES / GITOPS"
description: "AWS infrastructure and GitOps delivery for a construction management application, with Kubernetes orchestration, security controls, and observability."
role: "Software development contributor; independent Cloud & DevOps implementation"
period: "2026"
order: 1
technologies:
  - AWS
  - Terraform
  - Amazon EKS
  - Jenkins
  - Argo CD
  - OpenTelemetry
flow:
  - "Jenkins"
  - "Helm Git"
  - "Argo CD"
  - "Amazon EKS"
source: "https://github.com/Aoun62336/AssembleMonitor-DevOps"
---

## Context

AssembleMonitor is a construction management application with a React frontend, a FastAPI backend, and PostgreSQL storage.

I contributed to the application during my software development internship at Noorisys Technologies. After that work, I independently developed the AWS infrastructure and DevOps implementation documented in the repository.

The engineering focus was to define the infrastructure in code, automate application delivery, introduce security controls, and make the deployed system easier to observe.

## AWS infrastructure

I used Terraform to define AWS resources and Kubernetes infrastructure.

The EKS architecture includes:

- Networking across two Availability Zones.
- Public and private subnet separation.
- An Application Load Balancer and AWS WAF.
- EKS worker nodes in private subnets.
- Amazon RDS for PostgreSQL.
- Amazon S3 for object storage.
- IAM roles and security groups controlling access.

The application traffic path is:

`Application Load Balancer → Kubernetes frontend service → Nginx/React → FastAPI → PostgreSQL`

The backend uses IAM Roles for Service Accounts to access supported AWS services without embedding long-lived AWS keys inside the application.

## CI/CD and GitOps

I separated pre-merge checks from the release workflow.

GitHub Actions validates backend tests, frontend builds, Terraform, Helm, and secret scanning before code is merged.

The main Jenkins GitOps pipeline handles deeper checks and release preparation, including:

1. Source validation and security scanning.
2. SonarQube analysis and quality gate checks.
3. Frontend and backend builds.
4. Docker image builds and Trivy image scanning.
5. Versioned image publication to Docker Hub.
6. Approval before the release configuration changes.
7. Updating image references in Helm configuration and committing the changes to Git.

Argo CD watches the Git-managed desired state and synchronizes those changes to EKS.

**An important boundary:** Jenkins does not directly deploy workloads to EKS in this GitOps workflow. Its responsibility ends with the approved Git configuration change. Argo CD handles reconciliation in the cluster.

The repository also documents a separate K3s deployment path. That path uses a different delivery mechanism and is not part of the EKS GitOps flow described above.

## Security and secret management

The implementation combines:

- AWS WAF at the load balancer.
- IAM-based permissions and workload identity.
- Security groups and network boundaries.
- Trivy scanning in CI.
- SonarQube analysis.
- External Secrets Operator with AWS Secrets Manager.

External Secrets Operator synchronizes required secret values into Kubernetes without storing those values in source control.

## Observability and reliability

The observability work covers:

- OpenTelemetry instrumentation and collection.
- Prometheus-compatible metrics.
- Grafana dashboards.
- Loki logs.
- Tempo traces.
- Health checks and Kubernetes workload configuration.

I also documented controlled fault drills to inspect application behavior during selected database, API, and DNS failures.

These drills are engineering validation exercises, not evidence of a live production incident or a guaranteed service-level objective.

## Engineering decisions

### Why Terraform?

I wanted the infrastructure definition to be reviewable, reproducible, and version controlled.

### Why GitOps for EKS?

Keeping the deployment configuration in Git makes it easier to inspect the intended state and separates artifact production from cluster reconciliation.

### Why different CI and CD responsibilities?

The pipeline can validate and publish a release artifact without requiring Jenkins to directly control the Kubernetes cluster.

## What this project demonstrates

This project connects application delivery, AWS infrastructure, Kubernetes, security controls, and observability in one documented implementation.

The most useful learning was understanding the boundaries between infrastructure provisioning, application builds, desired deployment state, and cluster operations.

[Explore the source and technical documentation](https://github.com/Aoun62336/AssembleMonitor-DevOps)
