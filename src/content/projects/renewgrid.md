---
title: "RenewGrid"
category: "CI/CD / CONTAINERS / INFRASTRUCTURE AS CODE"
description: "A React, FastAPI, and PostgreSQL application used to develop and verify container delivery workflows with GitHub Actions, Jenkins, Docker Compose, and Terraform."
role: "Application and DevOps implementation"
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

RenewGrid is a full-stack application built with React and TypeScript, FastAPI, and PostgreSQL.

I used the application as a consistent baseline while working on several DevOps engineering areas: automated validation, container image publication, deployment verification, and infrastructure provisioning.

Using the same application across multiple workflows made it easier to compare tools and troubleshoot actual pipeline problems.

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

The repository includes recorded execution evidence for:

1. Terraform planning.
2. Applying the proposed configuration.
3. Reconciling the state after the apply.

This helped me understand how Terraform compares configuration with state, constructs an execution plan, and applies resource changes.

## Git workflow and release practices

I also worked with feature branches, pull requests, checks, and versioned releases to make repository changes easier to review and track.

These practices supported the CI/CD workflows rather than existing as a separate artificial exercise.

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
