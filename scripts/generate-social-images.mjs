import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const outputDirectory = "public/og";

const cards = [
  {
    name: "home",
    label: "ENGINEERING PORTFOLIO",
    lines: ["Cloud & DevOps", "Engineer."],
    description: "AWS  /  Kubernetes  /  Terraform  /  CI/CD",
  },
  {
    name: "assemblemonitor",
    label: "SELECTED WORK / CLOUD ARCHITECTURE",
    lines: ["AssembleMonitor", "AWS & GitOps"],
    description: "EKS  /  Terraform  /  Jenkins  /  Argo CD",
  },
  {
    name: "renewgrid",
    label: "SELECTED WORK / DELIVERY ENGINEERING",
    lines: ["RenewGrid", "CI/CD & Terraform"],
    description: "GitHub Actions  /  Jenkins  /  Docker",
  },
  {
    name: "callmissed",
    label: "SELECTED WORK / SERVERLESS",
    lines: ["CallMissed", "AI Workspace"],
    description: "AWS Lambda  /  ECR  /  GitHub OIDC",
  },
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createSvg(card) {
  const firstLine = escapeXml(card.lines[0]);
  const secondLine = escapeXml(card.lines[1]);
  const label = escapeXml(card.label);
  const description = escapeXml(card.description);

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
    >
      <defs>
        <radialGradient id="glow">
          <stop offset="0%" stop-color="#6D4059" stop-opacity=".46"/>
          <stop offset="100%" stop-color="#17151A" stop-opacity="0"/>
        </radialGradient>

        <linearGradient id="line">
          <stop offset="0%" stop-color="#D89BB0"/>
          <stop offset="100%" stop-color="#AAB99D"/>
        </linearGradient>
      </defs>

      <rect width="1200" height="630" fill="#17151A"/>

      <circle
        cx="1080"
        cy="100"
        r="480"
        fill="url(#glow)"
      />

      <rect
        x="34"
        y="34"
        width="1132"
        height="562"
        rx="18"
        fill="none"
        stroke="#625361"
        stroke-opacity=".75"
      />

      <path
        d="M80 148 H1120"
        stroke="#625361"
        stroke-opacity=".65"
      />

      <rect
        x="80"
        y="79"
        width="39"
        height="39"
        rx="10"
        fill="#29242B"
        stroke="#D89BB0"
        stroke-opacity=".7"
      />

      <text
        x="99"
        y="106"
        text-anchor="middle"
        fill="#F5F0E9"
        font-family="Georgia, serif"
        font-style="italic"
        font-size="30"
      >a</text>

      <circle cx="111" cy="108" r="3" fill="#D89BB0"/>

      <text
        x="136"
        y="104"
        fill="#F5F0E9"
        font-family="Arial, sans-serif"
        font-size="23"
        font-weight="700"
        letter-spacing="2"
      >AOUN MD.</text>

      <text
        x="1110"
        y="104"
        text-anchor="end"
        fill="#AAB99D"
        font-family="Arial, sans-serif"
        font-size="16"
        letter-spacing="2"
      >${label}</text>

      <text
        x="80"
        y="280"
        fill="#F5F0E9"
        font-family="Arial, sans-serif"
        font-size="70"
        font-weight="700"
        letter-spacing="-2"
      >${firstLine}</text>

      <text
        x="80"
        y="365"
        fill="#D89BB0"
        font-family="Georgia, serif"
        font-size="71"
        font-style="italic"
      >${secondLine}</text>

      <text
        x="82"
        y="461"
        fill="#C7C0C7"
        font-family="Arial, sans-serif"
        font-size="22"
      >${description}</text>

      <!-- Decorative technical routing motif -->

      <g
        fill="none"
        stroke="url(#line)"
        stroke-width="2"
        stroke-linecap="round"
        opacity=".8"
      >
        <path d="M845 295 H930 V240 H1004"/>
        <path d="M930 295 H1086 V352"/>
        <path d="M930 295 V430 H1032"/>
      </g>

      <rect
        x="807"
        y="264"
        width="75"
        height="62"
        rx="11"
        fill="#29242B"
        stroke="#D89BB0"
        stroke-width="2"
      />

      <rect
        x="1004"
        y="210"
        width="80"
        height="60"
        rx="11"
        fill="#29242B"
        stroke="#AAB99D"
        stroke-width="2"
      />

      <rect
        x="1046"
        y="352"
        width="80"
        height="60"
        rx="11"
        fill="#29242B"
        stroke="#E6BF94"
        stroke-width="2"
      />

      <rect
        x="1000"
        y="401"
        width="68"
        height="60"
        rx="11"
        fill="#29242B"
        stroke="#D89BB0"
        stroke-width="2"
      />

      <circle cx="844" cy="295" r="9" fill="#D89BB0"/>
      <circle cx="1044" cy="240" r="9" fill="#AAB99D"/>
      <circle cx="1086" cy="382" r="9" fill="#E6BF94"/>
      <circle cx="1034" cy="431" r="9" fill="#D89BB0"/>

      <path
        d="M80 531 H1120"
        stroke="#625361"
        stroke-opacity=".65"
      />

      <text
        x="80"
        y="570"
        fill="#E6BF94"
        font-family="Arial, sans-serif"
        font-size="19"
        letter-spacing="1"
      >aoun62336.github.io</text>

      <text
        x="1120"
        y="570"
        text-anchor="end"
        fill="#C7C0C7"
        font-family="Arial, sans-serif"
        font-size="16"
        letter-spacing="1"
      >CLOUD  /  SYSTEMS  /  DELIVERY</text>
    </svg>
  `;
}

await mkdir(outputDirectory, { recursive: true });

for (const card of cards) {
  const outputFile = join(
    outputDirectory,
    `${card.name}.png`,
  );

  await sharp(Buffer.from(createSvg(card)))
    .png({
      compressionLevel: 9,
      palette: false,
    })
    .toFile(outputFile);

  console.log(`Generated ${outputFile}`);
}