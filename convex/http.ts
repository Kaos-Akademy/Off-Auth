import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/issuer/webhook",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    const payload = await request.json();
    return new Response(
      JSON.stringify({
        received: true,
        note:
          "Webhook stub received. Add signature validation and decision routing before production.",
        payload,
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  }),
});

export default http;
