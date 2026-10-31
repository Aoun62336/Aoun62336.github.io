---
title: "RenewGrid"
category: "CI/CD / CONTAINERS / INFRASTRUCTURE AS CODE"
description: "An e-waste management application used to implement and verify CI/CD, container delivery, and local Terraform automation."
role: "DevOps internship: CI/CD, container delivery, and local infrastructure automation"
period: "2026"
order: 2
technologies:
  - GitHub Actions
  - Jenkins
  - Docker
  - Terraform
  - Trivy
  - AWS EC2
flow:
  - "Source"
  - "CI checks"
  - "Registry"
  - "Compose"
source: "https://github.com/Aoun62336/RenewGrid-Terraform-IaC"
---

## Context

RenewGrid is an e-waste recycling platform built with React, FastAPI, and PostgreSQL.

During my DevOps internship at Elevate Labs, I used this single codebase as a consistent testbed across three different delivery paths: GitHub Actions, an EC2-hosted Jenkins pipeline, and local Terraform Docker automation. Using the same application across all three environments made it easy to compare build speeds, security scans, and deployment behavior side by side.

## GitHub Actions and GHCR

I built a GitHub Actions workflow that validates the application and publishes Docker images to GitHub Container Registry.

The workflow includes:

- Frontend validation and build checks.
- Backend automated tests.
- Trivy security scanning.
- CycloneDX software bill of materials generation.
- Versioned container image publication.
- Docker Compose deployment verification.

The deployment verification runs in an ephemeral GitHub-hosted environment. It confirms that the application can be started and checked without requiring a permanent cloud server for every workflow run.

## Jenkins and Docker Hub

I also implemented a Jenkins pipeline running on an Ubuntu EC2 instance.

This workflow uses Docker Hub as the container registry and Docker Compose for deployment on the EC2 host.

It includes application validation, security checks, container builds, publication, and deployment verification.

During implementation, I investigated frontend lint failures and CI environment issues. Resolving those problems was part of the practical engineering work, not simply writing the initial pipeline configuration.

## Terraform

I created a separate Terraform repository to describe and manage the RenewGrid deployment environment.

**Scope matters here:** the Terraform configuration in this project uses the Docker provider to manage the Docker Compose-based deployment. It is not a Terraform implementation of an entire AWS VPC, EKS cluster, or managed database.

The managed Compose project includes PostgreSQL, an Alembic migration service, FastAPI, and the Nginx-served frontend. The migration service is a one-time initialization dependency that exits after successful completion. It is not expected to remain running like the application services.

Terraform manages the Compose project as a resource. Docker Compose handles the service-level startup dependencies inside that project.

The repository includes recorded execution evidence for:

1. Terraform planning.
2. Applying the proposed configuration.
3. Reconciling the state after the apply.

This helped me understand how Terraform compares configuration with state, constructs an execution plan, and applies resource changes.

## Deployment architecture boundaries

| Implementation | Environment | Purpose |
|---|---|---|
| GitHub Actions and GHCR | GitHub-hosted runners | Validate, publish images, and verify an ephemeral Compose stack |
| Jenkins and Docker Hub | Ubuntu EC2 instance | Build, scan, publish, and verify a Compose deployment on EC2 |
| Terraform Docker provider | Local Docker environment | Manage the Compose application stack as infrastructure code |

These are separate engineering implementations sharing the RenewGrid application. They are not three consecutive stages of one pipeline.

## Git workflow and release practices

I also worked with feature branches, pull requests, checks, and versioned releases to make repository changes easier to review and track.

These practices supported the CI/CD workflows rather than existing as a separate artificial exercise.

## Engineering challenge: getting the Jenkins pipeline to pass

The first Jenkins implementation did not immediately produce a successful release.

Frontend validation identified issues involving undefined or unused variables. The build environment also encountered npm cache permission problems, and earlier image scans identified dependency findings that required investigation.

I reviewed the failed stages, corrected the frontend issues, adjusted writable build locations, and reviewed affected dependencies before repeating the pipeline checks.

The recorded result was Jenkins Build #7 on October 24, 2026. That execution completed its configured stages successfully, including:

- 26 passing backend tests.
- Frontend build and lint validation.
- Container image builds.
- Configured Trivy vulnerability gates.
- CycloneDX SBOM generation.
- Versioned Docker Hub publication.
- Docker Compose deployment verification on EC2.

The security result describes that recorded execution. It does not mean the images will remain free of future vulnerabilities.

[Read the Jenkins verification record](https://github.com/Aoun62336/RenewGrid-Terraform-IaC/blob/main/evidence/jenkins/jenkins-verification.md)

## Engineering decisions

### Why two CI/CD platforms?

GitHub Actions and Jenkins allowed me to work with two different automation models using a common application.

GitHub Actions provided repository-native execution. Jenkins offered a self-managed build environment with its own operational requirements.

### Why Docker Compose?

Compose was appropriate for this application's deployment and verification scope. A Kubernetes cluster would have introduced more moving parts without providing a clear benefit for these workflows.

### Why keep ephemeral verification?

A short-lived validation environment reduces the need to pay for continuously running infrastructure just to confirm that containers can start and communicate.

## What this project demonstrates

RenewGrid shows practical experience with CI/CD implementation, debugging build failures, container registries, deployment verification, infrastructure state, and release processes.

The work also reinforced an important principle: an automated pipeline is only useful when its checks provide meaningful feedback about the application being delivered.

[Explore the Terraform and deployment repository](https://github.com/Aoun62336/RenewGrid-Terraform-IaC)
