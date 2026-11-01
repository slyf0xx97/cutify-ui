// Your own sites (ghernie.com) refuse to load inside frames on other sites. The recording browser drops
// those headers for that domain only, so the cover can show them live. Nothing changes on the sites themselves.
export async function allowFraming(context) {
  await context.route(/ghernie\.com/, async (route) => {
    if (route.request().resourceType() !== "document") return route.continue();
    const response = await route.fetch();
    const headers = { ...response.headers() };
    delete headers["x-frame-options"];
    delete headers["content-security-policy"];
    await route.fulfill({ response, headers });
  });
}
