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

## Portfolio content

The website includes:

- A professional introduction and downloadable resume.
- Dedicated engineering case studies for AssembleMonitor, RenewGrid, and CallMissed AI Workspace.
- Source-backed architecture diagrams and project evidence.
- An interactive architecture explorer for AssembleMonitor and a full-resolution image viewer.
- Two engineering notes on Terraform execution and Jenkins/Argo CD GitOps.
- Professional experience, education, and selected credentials.

The project descriptions distinguish documented implementation from live production operation.

## Design and accessibility

The visual system uses a custom Nocturne Plum palette, self-hosted typography, responsive layouts, and optimized images.

Interactions are built primarily with native browser APIs and CSS. The website supports keyboard navigation, semantic controls, and reduced-motion preferences.

## Social sharing

Social-preview images are generated from source code using Sharp.

To regenerate them:

```bash
node scripts/generate-social-images.mjs
```

The production build also generates these images automatically.

## Quality checks

Run:

```bash
npm run check
npm run build
npm run test:e2e
```

These checks cover the Astro project, static build, navigation, accessibility, responsive behavior, project images, resume availability, and interactive components.

## Deployment

Astro generates the website as static pages. GitHub Actions validates and publishes the output to GitHub Pages.

Cloudflare Web Analytics is optional and enabled through the `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` build variable.

No backend, database, or continuously running cloud infrastructure is required for the portfolio itself.

## Engineering evidence

The portfolio case studies document:

- The problem being addressed.
- The implementation and engineering decisions.
- The environment in which work was performed.
- Recorded testing and verification results.
- Limitations of the implementation.

The repositories contain source code, workflow definitions,
infrastructure configuration, and selected execution evidence.

Historical test results describe the recorded executions, not
continuous production reliability.

## Release validation

Pull requests targeting `master` run Astro diagnostics,
the static build, browser tests, and automated accessibility checks.

Production publication is restricted to `master`.

After GitHub Pages deployment, the workflow checks important
public routes, the downloadable resume, and a social-preview asset.

## Maintenance

Dependency update pull requests are reviewed through Dependabot.
Changes should pass the established checks before being merged.

The website uses static hosting and does not require a permanent
application server or database.

## Contact

- [GitHub](https://github.com/Aoun62336)
- [LinkedIn](https://www.linkedin.com/in/aoun26/)
- Email: aounmd74@gmail.com
