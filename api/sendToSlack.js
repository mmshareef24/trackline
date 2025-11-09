export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString() || '{}');

    const text = body.text || 'Test message';
    const webhook = process.env.SLACK_WEBHOOK_URL;

    if (!webhook) {
      return res.status(500).json({ error: 'Missing SLACK_WEBHOOK_URL' });
    }

    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return res.status(500).json({ error: 'Slack webhook failed', details: errText });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Unhandled error', details: e?.message || e });
  }
}