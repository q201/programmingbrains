// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    const appUrl = Deno.env.get('APP_URL') || 'https://programmingbrains.onrender.com';
    const cronSecret = Deno.env.get('CRON_SECRET') || '';

    // Trigger platform API to fetch & ingest news feeds automatically
    const res = await fetch(`${appUrl}/api/admin/news-sources/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret}`,
      },
    });

    const data = await res.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Daily news cron executed successfully',
        data,
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
