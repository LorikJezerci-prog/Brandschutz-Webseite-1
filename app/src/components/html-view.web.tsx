export function HtmlView({ html }: { html: string }) {
  return (
    <iframe
      title="Berichtsvorschau"
      srcDoc={html}
      style={{ flex: 1, width: '100%', height: '100%', border: 0, background: '#fff' }}
    />
  );
}
