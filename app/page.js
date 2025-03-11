export default function Home() {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>Email Handler API</h1>
        <p>This is a dedicated API server for handling email forwarding from Cloudflare Email Routing.</p>
        <p>The API endpoint is available at: <code>/api/emails/incoming</code></p>
      </div>
    );
  }