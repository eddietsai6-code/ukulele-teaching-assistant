import { getReleaseManifest } from "../../../_lib/catalog.js";
import { errorResponse, jsonResponse } from "../../../_lib/http.js";

export async function onRequestGet(context) {
  try {
    const manifest = await getReleaseManifest(context.env.UKEBOOK_DB, context.params.releaseId);
    if (!manifest) return jsonResponse({ error: "Catalog release not found." }, { status: 404 });
    const etag = `"${manifest.releaseId}"`;
    if (context.request.headers.get("if-none-match") === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          etag,
          "cache-control": "public, max-age=31536000, immutable"
        }
      });
    }
    return jsonResponse(manifest, {
      headers: { etag, "cache-control": "public, max-age=31536000, immutable" }
    });
  } catch (error) {
    return errorResponse(error, 400);
  }
}

