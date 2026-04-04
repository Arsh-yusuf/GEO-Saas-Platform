export interface AuditResponse {
  title: string | null;
  meta_description: string | null;
  headings: string[];
  image: string | null;
  json_ld: Record<string, any>;
}