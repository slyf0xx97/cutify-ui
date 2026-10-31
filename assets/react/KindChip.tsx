// cutify-ui: AI / Code / You tag. Fixed colours per theme come from .kind.ai / .kind.code / .kind.you. MIT.
export type Kind = "ai" | "code" | "you";
const LABEL: Record<Kind, string> = { ai: "AI", code: "Code", you: "You" };

export function KindChip({ kind }: { kind: Kind }) {
  return <span className={`kind ${kind}`}>{LABEL[kind]}</span>;
}
