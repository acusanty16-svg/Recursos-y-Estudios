# Conectar Ranking Online con Supabase (Gratis)

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. Entra en **SQL Editor**, pega el contenido de `supabase/schema.sql` y pulsa **Run**.
3. Ve a **Project Settings → API** y copia:
   - **Project URL** (`VITE_SUPABASE_URL`)
   - **anon / public key** (`VITE_SUPABASE_ANON_KEY`)
4. Para probar en local, crea un archivo `.env` en esta carpeta (`VersiculosJovenes/.env`) basándote en `.env.example`.
5. Para producción en **Vercel**, añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en **Project Settings → Environment Variables** y redeploya.

> Mientras no configures `.env`, la app funciona sin errores en modo local y guarda la XP de cada versículo en el dispositivo.
