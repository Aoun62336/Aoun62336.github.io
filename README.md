# Aoun Md. | Cloud & DevOps Engineer

My personal Cloud and DevOps engineering portfolio.

The website presents selected projects, engineering decisions,
infrastructure designs, CI/CD workflows, and practical experience
with cloud platforms and application delivery.

## Website

https://aoun62336.github.io/

## Featured Work

### AssembleMonitor

A construction management application with an independently
implemented AWS infrastructure and DevOps environment.

The engineering work includes Terraform, Amazon EKS, Jenkins,
Argo CD, Helm, security controls, secrets management, and
observability.

Repository:
https://github.com/Aoun62336/AssembleMonitor-DevOps

### RenewGrid

A full-stack e-waste management application with multiple
container delivery workflows.

The work includes GitHub Actions, Jenkins, GHCR, Docker Hub,
Docker Compose, and Terraform-based management of a local
Compose environment.

Repository:
https://github.com/Aoun62336/RenewGrid-Terraform-IaC

### CallMissed AI Workspace

A React and FastAPI application with chat and browser voice
features.

The serverless deployment implementation uses Terraform,
GitHub Actions, AWS OIDC, Amazon ECR, AWS Lambda,
CloudWatch, and deployment health verification.

Repository:
https://github.com/Aoun62336/CallMissed-Ai-Workspace

## Architecture Visuals

Each case study includes source-backed technical diagrams and project
screenshots. Editable SVG diagram sources and icon attribution notes are
available in [docs/architecture](docs/architecture/).

## Portfolio Technology

- Astro
- TypeScript
- HTML and CSS
- Playwright
- Automated accessibility checks
- GitHub Actions
- GitHub Pages

## Local Development

Requirements:

- Node.js 24
- npm

Install dependencies:

```bash
npm ci
```

Start local development:

```bash
npm run dev
```

Run release verification:

```bash
npm run check
npm run build
npm run test:e2e
```

Preview the production build:

```bash
npm run preview
```

## Deployment

GitHub Actions validates pull requests and deploys the static Astro
build to GitHub Pages after checks pass on `master`.

## Contact

- [GitHub](https://github.com/Aoun62336)
- [LinkedIn](https://www.linkedin.com/in/aoun26/)
- Email: aounmd74@gmail.com
