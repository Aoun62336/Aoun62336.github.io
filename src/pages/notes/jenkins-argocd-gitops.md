---
layout: ../../layouts/NoteLayout.astro
title: "Why Jenkins Builds and Argo CD Deploys"
description: "A practical explanation of CI responsibilities, Git-managed desired state, Kubernetes reconciliation, and the boundaries of a GitOps workflow."
category: "CI/CD / KUBERNETES / GITOPS"
---

## The problem

A delivery pipeline has two different responsibilities that are often combined.

The first is producing a release that has passed the required checks.

The second is making the running application match an approved deployment configuration.

These responsibilities are related, but they do not have to be performed by the same tool.

In my AssembleMonitor project, I separated them using Jenkins and Argo CD.

## What Jenkins does

Jenkins is responsible for the release preparation workflow.

The project pipeline includes source checks, security scanning, SonarQube analysis, quality gates, container builds, image scanning, and Docker Hub publication.

After the required approval, the GitOps path updates the container image reference in the Helm configuration stored in Git.

The pipeline commits that configuration change.

At this point, Jenkins has completed its responsibility for the primary EKS GitOps delivery path.

It has not directly applied the Kubernetes deployment manifests to EKS.

## What Argo CD does

Argo CD watches the desired Kubernetes state described in Git.

When the approved Helm configuration changes, Argo CD can detect that difference and reconcile the target cluster.

The process is conceptually:

```text
Jenkins builds and publishes an image
            |
            v
Approved image reference is committed to Git
            |
            v
Argo CD detects the desired-state change
            |
            v
Kubernetes workloads are reconciled
```

This makes Git the record of the intended application deployment configuration.

A successful Jenkins build does not, by itself, prove that the new workload has been reconciled successfully in the cluster.

Deployment status must be checked separately.

## Why not let Jenkins deploy directly?

Direct deployment from a pipeline is possible and can be appropriate.

However, the GitOps model provides useful separation.

The pipeline can focus on producing a validated artifact. The deployment controller focuses on comparing and reconciling desired state against the cluster.

This improves the visibility of deployment configuration changes and avoids relying only on pipeline execution history to understand what should be running.

It also introduces additional requirements: managing the GitOps repository, permissions, synchronization behavior, and application health.

GitOps is not automatically the best approach for every application.

## How rollback works conceptually

There are two things to distinguish.

One is an application image version.

The other is the Git configuration that declares which image version should be deployed.

Changing the approved image reference in Git can cause Argo CD to reconcile the cluster back toward that desired version.

However, returning to an earlier configuration is not guaranteed to resolve database migrations, incompatible data changes, or external dependencies.

Rollback must be considered alongside application compatibility and operational verification.

## How this relates to AssembleMonitor

The primary EKS delivery workflow uses:

- GitHub Actions for pre-merge validation.
- Jenkins for deeper release preparation and publication.
- Git for the approved Helm configuration.
- Argo CD for EKS synchronization.
- Kubernetes for workload reconciliation and runtime operation.

The repository also documents a separate K3s deployment path that uses a different delivery mechanism.

Those paths should not be represented as one continuous deployment system.

[Inspect the pipeline responsibilities](https://github.com/Aoun62336/AssembleMonitor-DevOps/blob/main/docs/ops/CI_CD_PIPELINE.md)

[Inspect the Jenkins pipeline](https://github.com/Aoun62336/AssembleMonitor-DevOps/blob/main/Jenkinsfile-gitops)

## How I verify success

I distinguish release validation from deployment validation.

For release validation, I inspect testing, scanning, build and publication results.

For deployment validation, I inspect the desired configuration, Argo CD synchronization, Kubernetes workloads, readiness, and application behavior.

A successful run in one part of the workflow does not replace verification in the others.

## What I learned

The value of GitOps is not simply adding Argo CD to a CI/CD diagram.

The important architectural decision is defining ownership.

Jenkins owns artifact preparation. Git records the desired deployment configuration. Argo CD reconciles that configuration. Kubernetes runs the workloads.

When those boundaries are clear, the delivery process is easier to explain, inspect, and troubleshoot.

