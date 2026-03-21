export interface Act {
  id: string;
  title: string;
  year: string;
  description: string;
  fullName?: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  files?: { name: string, data: string, mimeType: string }[];
}

export interface CaseAnalysis {
  caseName: string;
  cnr?: string;
  citation: string;
  year: string;
  bench: string;
  tags: string[];
  facts: string;
  coreIssues: string;
  arguments: string;
  judgement: string;
  holding: string;
  ratioDecidendi: string;
  status: string;
  primarySourceUrl: string;
}
