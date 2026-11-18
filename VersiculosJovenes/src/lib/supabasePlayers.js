const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '')
  .trim()
  .replace(/\/+$/, '')
  .replace(/\/rest\/v1$/i, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const TABLE_NAME = 'desafio_players';

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function buildHeaders(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

/** Inserta o actualiza el puntaje y nivel de estudio por versículo del jugador actual. */
export async function upsertPlayerScore(payload) {
  if (!isSupabaseConfigured()) {
    return { ok: false, reason: 'not_configured' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?on_conflict=id`, {
      method: 'POST',
      headers: buildHeaders({
        Prefer: 'resolution=merge-duplicates,return=representation',
      }),
      body: JSON.stringify({
        id: payload.id,
        name: payload.name,
        xp: payload.xp,
        verse_xp: payload.verseXp || {},
        mastered_count: payload.masteredCount || 0,
        finale_best_score: payload.finaleBestScore || 0,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return { ok: false, reason: msg || `HTTP ${res.status}` };
    }

    const rows = await res.json();
    return { ok: true, row: Array.isArray(rows) ? rows[0] : rows };
  } catch (err) {
    return { ok: false, reason: err?.message || 'network_error' };
  }
}

/** Obtiene el Ranking ordenado de mayor a menor XP. */
export async function fetchLeaderboard(limit = 50) {
  if (!isSupabaseConfigured()) {
    return { ok: false, reason: 'not_configured', players: [] };
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=id,name,xp,verse_xp,mastered_count,finale_best_score,updated_at&order=xp.desc,updated_at.asc&limit=${limit}`,
      {
        method: 'GET',
        headers: buildHeaders(),
      }
    );

    if (!res.ok) {
      return { ok: false, reason: `HTTP ${res.status}`, players: [] };
    }

    const rows = await res.json();
    return {
      ok: true,
      players: Array.isArray(rows)
        ? rows.map((row) => ({
            id: row.id,
            name: row.name,
            xp: Number(row.xp) || 0,
            verseXp: row.verse_xp && typeof row.verse_xp === 'object' ? row.verse_xp : {},
            masteredCount: Number(row.mastered_count) || 0,
            finaleBestScore: Number(row.finale_best_score) || 0,
            updatedAt: row.updated_at,
          }))
        : [],
    };
  } catch (err) {
    return { ok: false, reason: err?.message || 'network_error', players: [] };
  }
}
