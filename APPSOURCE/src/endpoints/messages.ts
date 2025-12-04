// src/endpoints/messages.ts

import { Context } from 'hono';

// Обработчик GET запросов
export async function getMessages(c: Context) {
    // Убедитесь, что эта строка выглядит ТОЧНО ТАК ЖЕ:
    const { DB } = c.env;
    try {
        // Используйте DB напрямую
        const { results } = await DB.prepare('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50').all();
        return c.json(results);
    } catch (error) {
        return c.json({ error: error.message }, 500);
    }
}

// Обработчик POST запросов
export async function createMessage(c: Context) {
    // Убедитесь, что эта строка выглядит ТОЧНО ТАК ЖЕ:
    const { DB } = c.env;
    try {
        const { author, content } = await c.req.json();
        const timestamp = Date.now();
        // Используйте DB напрямую
        await DB.prepare('INSERT INTO messages (author, content, timestamp) VALUES (?, ?, ?)')
            .bind(author, content, timestamp)
            .run();
        return c.text('OK', 200);
    } catch (error) {
        return c.json({ error: error.message }, 400);
    }
}


