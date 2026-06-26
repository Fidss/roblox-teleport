import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Username required' });

    try {
        const cleanUsername = username.trim().toLowerCase();
        const key = `respawn:${cleanUsername}`;
        const hasCommand = await kv.get(key);

        if (hasCommand === "true") {
            await kv.del(key); // Hapus antrean setelah dibaca agar tidak loop mati terus
            return res.status(200).json({ command: "respawn" });
        }
        return res.status(200).json({ command: "none" });
    } catch (error) {
        return res.status(500).json({ error: 'Database Error: ' + error.message });
    }
}
