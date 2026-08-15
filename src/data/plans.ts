export interface Plan {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  featured?: boolean;
  features: string[];
  cta: string;
}

export const plans: Plan[] = [
  {
    name: "Practice",
    price: "$39",
    cadence: "per seat / month",
    summary:
      "For small teams putting their first archive into a reasoning workspace.",
    features: [
      "5,000 pages indexed per seat",
      "Cross-document question answering",
      "Cited answers with source jumps",
      "Version comparison",
      "Email support within one business day",
    ],
    cta: "Start free trial",
  },
  {
    name: "Scale",
    price: "$89",
    cadence: "per seat / month",
    summary:
      "For legal, finance and research teams running review as a daily habit.",
    featured: true,
    features: [
      "50,000 pages indexed per seat",
      "Playbook deviation scoring",
      "Obligation and renewal monitoring",
      "Precedent-aware drafting",
      "SSO, SCIM and role-based access",
      "Shared workspaces and saved views",
    ],
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual agreement",
    summary:
      "For regulated organisations with residency, key management and audit requirements.",
    features: [
      "Unlimited indexing",
      "Customer-managed encryption keys",
      "US, EU or UK data residency",
      "Full audit export and retention policy",
      "Private model deployment",
      "Named solutions architect",
    ],
    cta: "Contact sales",
  },
];
