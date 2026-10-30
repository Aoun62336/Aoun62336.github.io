---
layout: ../../layouts/NoteLayout.astro
title: "How Terraform Decides What to Create"
description: "A practical explanation of Terraform configuration, state, planning, dependencies, execution order, and reconciliation."
category: "TERRAFORM / INFRASTRUCTURE AS CODE"
---

## The problem Terraform solves

Infrastructure changes are difficult to manage reliably when every resource is created and modified through separate manual commands.

A service might require a network, storage, credentials, a database, and an application deployment. These components have dependencies, and repeating the process manually makes it harder to know exactly which configuration is running.

Terraform provides a declarative model. I describe the resources I want, and Terraform compares that configuration with the state it manages.

That does not mean Terraform automatically understands every application's business requirements. The configuration and provider determine what Terraform can manage.

## What happens during initialization?

When I run:

```bash
terraform init
```

Terraform prepares the working directory.

It discovers the required providers, downloads or selects compatible provider versions, and initializes the configured backend.

The backend is responsible for storing Terraform state. Depending on the project, state can be local or stored remotely.

Initialization does not normally create the application infrastructure described by the configuration.

## How does Terraform know what already exists?

Terraform uses its state to track the remote resource objects associated with resource addresses in the configuration.

When planning, Terraform normally refreshes its understanding of managed resources through provider APIs and compares the resulting values with the desired configuration.

The three important inputs are:

1. Configuration: what should exist.
2. State and refreshed resource information: what Terraform currently knows about managed objects.
3. Provider behavior: how resources are read, created, updated, and deleted.

A resource that is missing may need creation. A changed argument may require an update or replacement. A resource removed from the configuration may need destruction.

The exact action depends on the provider and resource schema.

## How is the execution order decided?

Terraform constructs a dependency graph.

For example, imagine an application that needs a database before a migration can run.

Conceptually:

```text
Database → Migration → Application
```

The migration depends on the database, and the application depends on the migration.

Where Terraform manages these as separate resources, explicit references or dependency declarations can express the necessary ordering.

Terraform does not assign a universal priority such as "networks always run first." It follows the dependencies represented in the configuration.

Independent operations can run concurrently, subject to Terraform's parallelism limits.

## What does `terraform plan` do?

The plan describes proposed actions before they are applied.

It can identify:

- Resources to create.
- Resources to update.
- Resources to replace.
- Resources to destroy.
- Outputs that may change.

A plan is an opportunity to inspect what Terraform intends to do.

It is not proof that the proposed infrastructure has already been created.

## What happens during `terraform apply`?

Terraform executes the approved plan through provider operations.

For each managed resource, Terraform uses the provider implementation to make the required changes and read the resulting state.

Operations that depend on others must wait for their prerequisites.

If a provider operation fails, Terraform reports the failure. It does not promise an automatic rollback of every preceding successful operation.

This is why planning, state management, error handling, and verification matter.

## How I used this in RenewGrid

My RenewGrid Terraform implementation uses the Docker provider.

The configuration manages a Docker Compose project that contains:

- PostgreSQL.
- An Alembic migration service.
- A FastAPI application.
- A React frontend served through Nginx.
- Networks and persistent volumes.

Terraform manages the Compose project through its provider resource. Within that environment, Docker Compose handles service dependencies and startup coordination.

This boundary is important. Terraform is not individually scheduling every container startup operation.

The repository records initialization, planning, apply, state inspection, reconciliation, and teardown.

[Inspect the Terraform configuration](https://github.com/Aoun62336/RenewGrid-Terraform-IaC/blob/main/terraform/main.tf)

[Inspect the recorded execution evidence](https://github.com/Aoun62336/RenewGrid-Terraform-IaC/tree/main/evidence/terraform/renewgrid)

## What does a no-change plan prove?

A no-change plan indicates that Terraform did not identify changes needed for the managed configuration at that point in time.

It does not prove that the whole application is healthy.

For example, a database container could be running while the application still has a functional problem.

Infrastructure reconciliation and application verification are different checks.

## What I learned

Terraform is most useful when configuration, state, dependencies, and verification are treated as one engineering process.

The important questions are not simply whether `terraform apply` finishes successfully.

I also need to understand what changed, why the change was proposed, what the provider actually managed, and whether the resulting application behaves as expected.

