// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { v4 as uuidv4 } from "uuid";
import { SfacgDownloader } from "../_shared/Sfacg/SfacgDownload.ts";
// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const CACHE_CONTROL = "public, no-cache, must-revalidate";
Deno.serve(async (req) => {
  const rawOrigin = req.headers.get("Origin");
  const Header = new Headers();
  Header.set("Access-Control-Allow-Origin", rawOrigin!);
  Header.set("Cache-Control", CACHE_CONTROL);
  Header.append("Vary", "Accept-Encoding");
  Header.append("Vary", "Origin");
  const deviceToken = uuidv4().toUpperCase(); // 现在这是允许的，因为它在事件处理函数中
  const { novelId, publisher, Sfcookie } = await req.json();
  const d = new SfacgDownloader(deviceToken, novelId, publisher, Sfcookie);
  /**  txt Maker */
  const { novelName, data } = await d.TxtMake();
  Header.set("Content-Type", "text/plain");
  Header.set(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(novelName!)
      .replace(/['()]/g, escape)
      .replace(/\*/g, "%2A")}.txt"`
  );
  Header.set("Access-Control-Expose-Headers", "Content-Disposition");
  return new Response(data, {
    headers: Header,
  });
  // const rawOrigin = req.headers.get("Origin");
  // const Header = new Headers();
  // Header.set("Access-Control-Allow-Origin", rawOrigin!);
  // Header.set("Cache-Control", CACHE_CONTROL);
  // Header.append("Vary", "Accept-Encoding");
  // Header.append("Vary", "Origin");
  // const {
  //   init: { devicetoken, novelId, publisher, Sfcookie },
  //   data: NoDataList,
  // } = await req.json();
  // console.log(devicetoken, novelId, publisher, Sfcookie);
  // const d = new cf_SfacgDownloader(devicetoken, novelId, publisher, Sfcookie);
  // const r = await d.cf_Handle_DataGet(NoDataList);
  // return new Response(JSON.stringify(r), {
  //   status: 200,
  //   headers: Header,
  // });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP req:

  curl -i --location --req POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
