
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({
      error: 'OPENAI_API_KEY is not set. Please configure it in your environment variables.'
    });
  }

  try {
    const { title, description, category } = req.body || {};

    if (!title) {
      return res.status(400).json({ error: 'Objective title is required' });
    }

    const systemPrompt = `You are an expert OKR and KPI consultant. 
    Your task is to generate relevant, measurable, and specific Key Performance Indicators (KPIs) or Key Results for a given Objective.
    
    Return ONLY a JSON array of objects. Do not include any markdown formatting or explanation.
    Each object should have:
    - title: (string) A clear, measurable key result title
    - metricType: (string) One of: 'percentage', 'currency', 'number'
    - unit: (string) e.g., '%', 'SAR', 'users', 'hours'
    - targetValue: (number) A reasonable suggested target value
    - currentValue: (number) Usually 0
    
    Example response format:
    [
      { "title": "Achieve $1M ARR", "metricType": "currency", "unit": "USD", "targetValue": 1000000, "currentValue": 0 },
      { "title": "Increase NPS to 50", "metricType": "number", "unit": "", "targetValue": 50, "currentValue": 0 }
    ]`;

    const userPrompt = `Generate 3-5 strong KPIs for this objective:
    Title: ${title}
    Description: ${description || 'N/A'}
    Category: ${category || 'General'}
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Upstream error', details: errText });
    }

    const data = await response.json();
    let content = data?.choices?.[0]?.message?.content || '[]';
    
    // Cleanup markdown if present
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let kpis = [];
    try {
      kpis = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      return res.status(500).json({ error: 'Failed to parse AI suggestions' });
    }

    return res.status(200).json({ kpis });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
