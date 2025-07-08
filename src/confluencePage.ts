import api, { route } from "@forge/api";
import type { CreatePagePayload } from "./actionpayload";
import {
  type CreatePageResult,
  type CreatePageResultSet,
  PageBuilder,
} from "./confluence/zpage";

export async function createPage(payload: CreatePagePayload) {
  console.log(`Rovo sent:
    spaceId: ${payload.spaceId}
    parentId: ${payload.parentId}
    title: ${payload.title}
    content: ${payload.content}`);
  const page = new PageBuilder()
    .setSpaceId(payload.spaceId)
    .setParentId(payload.parentId)
    .setTitle(payload.title)
    .setADFContent(PageBuilder.markdownToADF(payload.content))
    .build()
    .toString();
  console.log(`Constructed request body:
    ${page}`);
  try {
    const response = await api
      .asUser()
      .requestConfluence(route`/wiki/api/v2/pages`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: page,
      });
    console.log(`Response: ${response.status} ${response.statusText}`);
    // console.debug(JSON.stringify(await response.json()));
    if (response.ok) {
      console.debug(`Success: created "${page}`);
      const responseJson = (await response.json()) as CreatePageResultSet;
      const pageResult = responseJson.results[0] as CreatePageResult;
      const renderedResult = `[${pageResult.title}](${pageResult._links.webui})\n`;
      console.debug(`Page: ${pageResult.id} ${renderedResult}`);
      return renderedResult;
    }
    // TODO: check status codes and throw errors
    console.error(`Failed to create new page:
      ${page}`);
    return `Failed to create new page:
      ${page}\n`;
  } catch (error) {
    console.log(error);
    return `Failed to create new page:
      ${page}\n`;
  }
}
