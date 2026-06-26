import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { username } = req.body;
    if (!username || username.trim() === "") {
        return res.status(400).json({ error: 'Username tidak boleh kosong' });
    }

    try {
        const cleanUsername = username.trim().toLowerCase();
        // Simpan perintah ke Redis, expired dalam 60 detik jika bot offline
        await kv.set(`respawn:${cleanUsername}`, "true", { ex: 60 });
        return res.status(200).json({ success: true, message: `Respawn dikirim ke ${username}` });
    } catch (error) {
        return res.status(500).json({ error: 'Database Error: ' + error.message });
    }
}
