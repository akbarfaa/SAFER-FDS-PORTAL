import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Custom Edge Proxy to route /api requests to the VPS backend
async function handleApiProxy(request: Request): Promise<Response> {
  const url = new URL(request.url);
  // Construct the target VPS URL (preserving the path and query string)
  const targetUrl = `http://43.159.61.165:8000${url.pathname}${url.search}`;

  // Clone headers but clean/remove headers that cause Cloudflare WAF Error 1003
  const cleanHeaders = new Headers();
  request.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    // Do NOT forward Cloudflare-specific headers or host-spoofing headers
    if (
      !k.startsWith("cf-") && 
      !k.startsWith("x-forwarded-") && 
      k !== "host" && 
      k !== "connection" &&
      k !== "sec-ch-ua" &&
      k !== "sec-ch-ua-mobile" &&
      k !== "sec-ch-ua-platform"
    ) {
      cleanHeaders.set(key, value);
    }
  });

  try {
    const proxyResponse = await fetch(targetUrl, {
      method: request.method,
      headers: cleanHeaders,
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.clone().arrayBuffer() : undefined,
      redirect: "manual",
    });

    // Return the response with CORS headers to avoid browser blocks
    const newHeaders = new Headers(proxyResponse.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    newHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return new Response(proxyResponse.body, {
      status: proxyResponse.status,
      statusText: proxyResponse.statusText,
      headers: newHeaders,
    });
  } catch (err: any) {
    console.error("API Proxy Error:", err);
    return new Response(JSON.stringify({ error: "API Proxy failed", details: err.message }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    
    // If it's an API request, proxy it directly to the VPS backend
    if (url.pathname.startsWith("/api/")) {
      // Handle CORS preflight requests directly
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });
      }
      return await handleApiProxy(request);
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
