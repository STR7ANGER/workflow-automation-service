const traces = [
  "Webhook received",
  "Condition matched",
  "Approval requested",
  "Slack message sent",
];
export default function Page() {
  return (
    <main>
      <header>
        <div>
          <span>Durable automation</span>
          <h1>Workflows that remember.</h1>
          <p>
            Publish, observe, approve, recover, and redrive long-running
            executions.
          </p>
        </div>
        <button>New workflow</button>
      </header>
      <section className="metrics">
        <article>
          <b>128</b>
          <small>Running</small>
        </article>
        <article>
          <b>99.8%</b>
          <small>Success</small>
        </article>
        <article>
          <b>2</b>
          <small>Dead letters</small>
        </article>
      </section>
      <h2>Live trace</h2>
      <section>
        {traces.map((x, i) => (
          <article className="trace" key={x}>
            <em>{i + 1}</em>
            <strong>{x}</strong>
            <span>{i === 2 ? "Waiting" : "Complete"}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
