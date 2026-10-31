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
source: "https://github.com/Aoun62336/CallMissed-Ai-Workspace"
---

## Context

CallMissed AI Workspace is a browser application combining chat, image generation, and real-time voice sessions via external AI services.

While AssembleMonitor explored a dedicated Kubernetes cluster for always-on workloads, this project takes the opposite approach: running a containerized FastAPI backend on serverless AWS Lambda. The goal was to build a low-cost, on-demand architecture with automated OIDC deployments and verification rollbacks.

## Application architecture

The frontend provides the user interface.

The FastAPI backend handles application requests and integration with the external AI service.

For browser voice sessions, the backend creates the necessary session information before the browser connects through the supported provider flow.

The React build and FastAPI service run in the same AWS Lambda container through the Lambda Web Adapter. The Lambda Function URL uses AWS authorization type `NONE`, with reviewer access controls implemented by the application for protected functionality.

Voice media does not pass through Lambda after session creation. The browser connects directly to the provider's WebRTC service using temporary connection information returned through FastAPI.

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

The workflow includes logic to restore the previous Lambda image when health verification fails after deployment.

The recorded evidence demonstrates a previous-image rollback and restoration exercise. It does not establish that the workflow's automatic health-failure branch was exercised during that particular test.

The implemented rollback path also has defined limits. Failures occurring before its recovery section are not necessarily covered, and the restoration logic does not perform a second complete application-health-check loop after restoring the previous image.

The recovery mechanism should therefore be described as implemented deployment protection, not comprehensive automatic recovery from every failure.

## Engineering decisions

### Why Lambda instead of EKS?

The application did not require a full Kubernetes platform for its deployment model.

Lambda allowed the backend to use a container image while reducing infrastructure management.

### Why no database?

Permanent conversation history was outside the application's scope.

The interface maintains temporary conversation state, avoiding a persistent database that would introduce additional operations, cost, and data-management responsibilities.

### Why no VPC attachment?

The backend primarily needs outbound HTTPS access to the external provider and required AWS services.

The application does not depend on private VPC resources, so adding VPC networking and NAT would introduce additional complexity without solving a current requirement.

### Why avoid automatic retries of ambiguous paid requests?

An external provider may complete a request even if the application times out before receiving the result.

Automatically repeating chat, image, or voice creation in that situation could cause duplicate provider usage and additional charges.

The implementation therefore avoids automatic retries when the result of a paid request is ambiguous.

### Why immutable image references?

A specific image version makes it easier to identify which application artifact is deployed and which previous artifact should be used for rollback.

### Why GitHub OIDC?

OIDC provides short-lived AWS access for the deployment workflow without requiring permanent credentials in the repository.

## What this project demonstrates

This project covers application integration, serverless infrastructure, container delivery, deployment authentication, security checks, health verification, and rollback design.

It also provides a useful comparison with my Kubernetes-based work: different applications can justify different levels of infrastructure complexity.
