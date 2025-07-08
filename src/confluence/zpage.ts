import * as z from "zod";

const PageStatusEnum = z.enum(["current", "draft"]);
const PageSubtypeEnum = z.enum(["live"]);
const ContentRepresentationEnum = z.enum([
  "storage",
  "atlas_doc_format",
  "wiki",
]);

type PageStatus = z.infer<typeof PageStatusEnum>;
type PageSubtype = z.infer<typeof PageSubtypeEnum>;

const CreatePageBodySchema = z.object({
  representation: ContentRepresentationEnum,
  value: z.string().min(1),
});

const CreatePageSchema = z
  .object({
    spaceId: z.string().min(1),
    status: PageStatusEnum,
    title: z.string().min(1),
    parentId: z.string().min(1),
    body: CreatePageBodySchema,
    subtype: PageSubtypeEnum.nullable().transform((val) =>
      val === null ? undefined : val,
    ),
  })
  .transform((obj) => ({
    ...obj,
    toString: () => JSON.stringify(obj),
  }));

type CreatePage = z.infer<typeof CreatePageSchema>;

export class PageBuilder {
  private page: Partial<CreatePage> = {};

  public setSpaceId(spaceId: string): PageBuilder {
    this.page.spaceId = spaceId;
    return this;
  }

  public setTitle(title: string): PageBuilder {
    this.page.title = title;
    return this;
  }

  public setParentId(parentId: string): PageBuilder {
    this.page.parentId = parentId;
    return this;
  }

  public setStatus(status: PageStatus): PageBuilder {
    this.page.status = status;
    return this;
  }

  public setSubtype(subtype: PageSubtype): PageBuilder {
    this.page.subtype = subtype;
    return this;
  }

  public setWikiContent(content: string): PageBuilder {
    this.page.body = {
      representation: ContentRepresentationEnum.enum.wiki,
      value: content,
    };
    return this;
  }

  public setADFContent(content: string): PageBuilder {
    this.page.body = {
      representation: ContentRepresentationEnum.enum.atlas_doc_format,
      value: content,
    };
    return this;
  }

  public setStorageContent(content: string): PageBuilder {
    this.page.body = {
      representation: ContentRepresentationEnum.enum.storage,
      value: content,
    };
    return this;
  }

  public static plainTextToADF(content: string): string {
    // TODO: Use a library.
    const doc = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        },
      ],
    };
    return JSON.stringify(doc);
  }

  public static markdownToADF(content: string): string {
    // TODO: Use a library.
    const doc = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        },
      ],
    };
    return JSON.stringify(doc);
  }

  public static pageUrlToPageId(url: string): string {
    return url;
  }

  public static spaceNameToSpaceId(name: string): string {
    return name;
  }

  public build(): CreatePage {
    const parsedPage = CreatePageSchema.parse(this.page);
    return parsedPage;
  }
}

const PageVersionSchema = z.object({
  createdAt: z.string().datetime(), // v4: z.iso.datetime("YYYY-MM-DDTHH:mm:ss.sssZ")
  message: z.string().min(1),
  number: z.number().int().positive(), // v4: z.int().positive()
  minorEdit: z.boolean(),
  authorId: z.string().min(1),
});

const PageBodySchema = z.object({
  storage: z.string(),
  atlas_doc_format: ContentRepresentationEnum,
});

const CreatePageResultSchema = z.object({
  id: z.string().min(1),
  status: PageStatusEnum,
  title: z.string().min(1),
  spaceId: z.string().min(1),
  parentId: z.string().min(1),
  parentType: z.string().min(1),
  position: z.number().int().positive(), // v4: z.int().positive()
  authorId: z.string().min(1),
  ownerId: z.string().min(1),
  lastOwnerId: z.string().min(1),
  subtype: PageSubtypeEnum,
  createdAt: z.string().datetime(), // v4: z.iso.datetime("YYYY-MM-DDTHH:mm:ss.sssZ")
  version: PageVersionSchema,
  body: PageBodySchema,
  _links: z.record(z.string(), z.string()),
});

export const CreatePageResultSetSchema = z.object({
  results: z.array(CreatePageResultSchema),
  _links: z.record(z.string(), z.string()),
});

export type CreatePageResult = z.infer<typeof CreatePageResultSchema>;
export type CreatePageResultSet = z.infer<typeof CreatePageResultSetSchema>;

/*
{
  "results": [
    {
      "id": "<string>",
      "status": "current",
      "title": "<string>",
      "spaceId": "<string>",
      "parentId": "<string>",
      "parentType": "page",
      "position": 57,
      "authorId": "<string>",
      "ownerId": "<string>",
      "lastOwnerId": "<string>",
      "subtype": "<string>",
      "createdAt": "<string>",
      "version": {
        "createdAt": "<string>",
        "message": "<string>",
        "number": 19,
        "minorEdit": true,
        "authorId": "<string>"
      },
      "body": { "storage": {}, "atlas_doc_format": {} },
      "_links": {
        "webui": "<string>",
        "editui": "<string>",
        "tinyui": "<string>"
      }
    }
  ],
  "_links": { "next": "<string>", "base": "<string>" }
}
*/
