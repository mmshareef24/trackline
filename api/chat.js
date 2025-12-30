export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({
      error: 'OPENAI_API_KEY is not set. Configure it in your environment.'
    });
  }

  try {
    const { messages = [], question = '', context = '' } = req.body || {};

    const systemPrompt = [
      'You are an assistant for JASCO Insight, a Balanced Scorecard and OKR platform.',
      'Help users with:
       - Navigating dashboards and modules (Production, Project, Finance, Sales, Supply Chain, Executive)\n',
      '       - Understanding KPIs, targets, trends, and drill-downs\n',
      '       - Using the Balanced Scorecard, exports, and training guide\n',
      'When answering, be concise and practical. If relevant, suggest where to click in the app. If unsure, ask clarifying questions.',
    ].join('\n');

    const payloadMessages = [
      { role: 'system', content: systemPrompt + (context ? `\nContext:\n${context}` : '') },
      ...messages,
      question ? { role: 'user', content: question } : null,
    ].filter(Boolean);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: payloadMessages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Upstream error', details: errText });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '';
    return res.status(200).json({ answer: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}