export interface Step {
  folder_id: string;
  title: string;
  question: string;
  stepTitle: string;
  options: (string | SymptomOptions)[];
  subtitle?: string;
  label?: string;
  other?: boolean;
}

export interface SymptomOptions {
  id: string;
  name: string;
}
