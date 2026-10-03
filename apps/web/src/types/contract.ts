export type ScanStatus = "queued" | "running" | "completed" | "partial" | "failed" | "canceled";
export type StageStatus = "pending" | "running" | "done" | "failed" | "skipped";
export type StageName = "clone" | "secrets" | "dependencies" | "code_patterns" | "ai_triage";

export type Severity = "critical" | "high" | "medium" | "low";
export type Confidence = "high" | "medium" | "low";
export type Category = "secrets" | "injection" | "dependencies" | "dangerous_practices";
export type TriageStatus = "open" | "ignored" | "false_positive" | "fixed";

export interface Stage {
  name: StageName;
  status: StageStatus;
  startedAt?: string;
  finishedAt?: string;
  error?: { code: string; message: string };
}

export interface Coverage {
  languages: { name: string; level: "full" | "partial" }[];
  filesScanned: number;
  filesSkipped: number;
  notes: string[];
}

export interface ScanSummary {
  score: number;
  scoreBreakdown: { severity: Severity; count: number; pointsLost: number }[];
  bySeverity: Record<Severity, number>;
  byCategory: Record<Category, number>;
  byFolder: { path: string; count: number; maxSeverity: Severity }[];
}

export interface Scan {
  id: string;
  status: ScanStatus;
  source: {
    type: "snippet" | "github";
    repoUrl?: string;
    ref?: string;
    commitSha?: string;
  };
  stages: Stage[];
  coverage: Coverage;
  createdAt: string;
  finishedAt?: string;
  summary?: ScanSummary;
  signature?: string;
}

export interface AiAnalysis {
  status: "pending" | "ready" | "failed" | "skipped";
  verdict?: "likely_exploitable" | "needs_review" | "likely_false_positive";
  explanation?: string;
  fix?: { description: string; patch: string };
  disclaimer?: string;
}

export interface Finding {
  id: string;
  fingerprint: string;
  scanId: string;
  tool: "semgrep" | "gitleaks" | "osv";
  ruleId: string;
  category: Category;
  title: string;
  severity: Severity;
  confidence: Confidence;
  cwe: string[];
  owasp: string[];
  location?: {
    file: string;
    startLine: number;
    endLine: number;
    snippet?: string;
    snippetMasked: boolean;
    snippetStartLine: number;
  };
  dependency?: {
    name: string;
    installedVersion: string;
    fixedVersion?: string;
    advisoryIds: string[];
  };
  triage: { status: TriageStatus; reason?: string; updatedAt?: string };
  ai: AiAnalysis;
}

// Formato do arquivo de fixture (espelha GET /scans/{id} + GET /scans/{id}/findings)
export interface ScanFixture {
  scan: Scan;
  findings: Finding[];
}