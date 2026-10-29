---
title: "CallMissed AI Workspace"
category: "SERVERLESS / AWS / AUTOMATED DELIVERY"
description: "A browser-based AI workspace with a FastAPI service and an AWS Lambda container deployment workflow."
role: "Application and serverless deployment implementation"
period: "2026"
order: 3
technologies:
  - React
  - FastAPI
  - AWS Lambda
  - Amazon ECR
  - Terraform
  - GitHub Actions
flow:
  - "GitHub"
  - "AWS OIDC"
  - "Amazon ECR"
  - "Lambda"
---

## Context

CallMissed AI Workspace is a React and TypeScript frontend backed by FastAPI.

The application integrates with the CallMissed API and supports browser-based interactions, including chat and voice session flows.

The deployment work explores a different operational model from AssembleMonitor: a container-based serverless backend instead of a managed Kubernetes cluster.

## Application architecture

The frontend provides the user interface.

The FastAPI backend handles application requests and integration with the external AI service.

For browser voice sessions, the backend creates the necessary session information before the browser connects through the supported provider flow.

Some application capabilities depend on an external service and its access requirements. A public code repository does not mean all third-party functionality is available as a free, unrestricted live demo.

## AWS serverless infrastructure

Terraform defines supporting AWS resources, including:

- Amazon ECR for container images.
- AWS Lambda for the backend runtime.
- IAM roles and permissions.
- AWS Secrets Manager.
- Amazon CloudWatch logging resources.
- GitHub Actions OIDC trust and deployment permissions.

The backend is packaged as a container image and published to ECR.

This arrangement avoids maintaining a continuously running EC2 server or Kubernetes cluster for the backend.

## Deployment automation

The GitHub Actions workflow includes application checks, container validation, security scanning, and deployment steps.

For AWS authentication, the workflow uses OIDC rather than storing a long-lived AWS access key in GitHub repository secrets.

The deployment process also includes health verification and logic to return to a previous image when the release verification fails.

The rollback mechanism is a deployment safeguard. It should not be interpreted as proof that every possible runtime failure can be detected or automatically recovered from.

## Engineering decisions

### Why Lambda instead of EKS?

The application did not require a full Kubernetes platform for its deployment model.

Lambda allowed the backend to use a container image while reducing infrastructure management.

### Why immutable image references?

A specific image version makes it easier to identify which application artifact is deployed and which previous artifact should be used for rollback.

### Why GitHub OIDC?

OIDC provides short-lived AWS access for the deployment workflow without requiring permanent credentials in the repository.

## What this project demonstrates

This project covers application integration, serverless infrastructure, container delivery, deployment authentication, security checks, health verification, and rollback design.

It also provides a useful comparison with my Kubernetes-based work: different applications can justify different levels of infrastructure complexity.
