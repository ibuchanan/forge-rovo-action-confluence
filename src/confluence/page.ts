export enum PageStatus {
  Current = "current",
  Draft = "draft",
}

export enum PageSubtype {
  Publishable,
  Live = "live",
}

export enum ContentRepresentation {
  Storage = "storage",
  AtlassianDocFormat = "atlas_doc_format",
  Wiki = "wiki",
}

export interface PageBody {
  representation: ContentRepresentation;
  value: string;
}

export interface Page {
  spaceId: string;
  status: PageStatus;
  title: string;
  parentId: string;
  body: PageBody;
  subtype?: PageSubtype;
}

export class PageBuilder {
  private spaceId: string = "";
  private status: PageStatus = PageStatus.Current;
  private title: string = "";
  private parentId: string = "";
  private body: PageBody = {
    representation: ContentRepresentation.AtlassianDocFormat,
    value: "",
  };
  private subtype: PageSubtype = PageSubtype.Publishable;

  public setSpaceId(spaceId: string): PageBuilder {
    this.spaceId = spaceId;
    return this;
  }

  public setTitle(title: string): PageBuilder {
    this.title = title;
    return this;
  }

  public setParentId(parentId: string): PageBuilder {
    this.parentId = parentId;
    return this;
  }

  public setStatus(status: PageStatus): PageBuilder {
    this.status = status;
    return this;
  }

  public setSubtype(subtype: PageSubtype): PageBuilder {
    this.subtype = subtype;
    return this;
  }

  public setWikiContent(content: string): PageBuilder {
    this.body = {
      representation: ContentRepresentation.Wiki,
      value: content,
    };
    return this;
  }

  public setADFContent(content: string): PageBuilder {
    this.body = {
      representation: ContentRepresentation.AtlassianDocFormat,
      value: content,
    };
    return this;
  }

  public setStorageContent(content: string): PageBuilder {
    this.body = {
      representation: ContentRepresentation.Storage,
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

  public build(): Page {
    /*
    // Validate the partially built object against the Zod schema
    const parsedUser = UserSchema.parse(this.user);
    return parsedUser;
    */
    const page: Page = {
      spaceId: this.spaceId,
      status: this.status,
      title: this.title,
      parentId: this.parentId,
      body: this.body,
    };
    // The default PageSubtype = Publishable means the default is 0.
    if (this.subtype) {
      page.subtype = this.subtype;
    }
    return page;
  }
}
