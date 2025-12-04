export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/messages' && request.method === 'POST') {
      try {
        const { author, content } = await request.json();
        const timestamp = Date.now();
        await env.DB.prepare('INSERT INTO messages (author, content, timestamp) VALUES (?, ?, ?)')
                  .bind(author, content, timestamp)
                  .run();
        return new Response('OK', { status: 200 });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }
    }

    if (url.pathname === '/api/messages' && request.method === 'GET') {
      try {
        const { results } = await env.DB.prepare('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50').all();
        return new Response(JSON.stringify(results), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
