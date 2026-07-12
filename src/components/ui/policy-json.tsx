function syntaxHighlight(json: string) {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-[var(--warning)]";
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "text-[var(--accent)]" : "text-[var(--success)]";
      } else if (/true|false/.test(match)) {
        cls = "text-[var(--info)]";
      } else if (/null/.test(match)) {
        cls = "text-[var(--text-muted)]";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export function PolicyDocument({ document }: { document: unknown }) {
  const json = JSON.stringify(document, null, 2);
  return (
    <pre
      className="overflow-x-auto rounded-md border p-4 font-mono text-[12px] leading-relaxed"
      style={{ background: "var(--code-bg)", borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
      dangerouslySetInnerHTML={{ __html: syntaxHighlight(json) }}
    />
  );
}
