import * as z from "zod";
import { EventContextSchema } from "../forge/zevents";

const RovoProductDetailSchema = z.object({
  url: z.string().url(), // v4: z.url()
  resourceType: z.string().min(1),
});

/*
"payload": {
  "input1ToYourAction": 1241,
  "input2ToYourAction": 12412,
  "context": {
    "cloudId": "7607d59e-650b-4c16-adcf-c19d17c915ac",
    "moduleKey": "sum-2-numbers-new-action",
    "jira": {
      "url": "https://mysite.atlassian.com/browse/FAA-1",
      "resourceType": "issue",
      "issueKey": 1,
      "issueId": 123,
      "issueType": "story",
      "issueTypeId": 1234,
      "projectKey": "FAA",
      "projectId": 5678
    }
  }
}
*/
const JiraIssueDetailSchema = RovoProductDetailSchema.extend({
  issueKey: z.string().regex(/^([A-Z][A-Z0-9]+-[0-9]+)/),
  issueId: z.number().int().positive(), // v4: z.int().positive()
  issueType: z.string().min(1),
  issueTypeId: z.number().int().positive(), // v4: z.int().positive()
  projectKey: z.string().min(1), // v4: z.string().uppercase().min(1)
  projectId: z.number().int().positive(), // v4: z.int().positive()
});

/*
"payload": {
  "input1ToYourAction": 1241,
  "input2ToYourAction": 12412,
  "context": {
    "cloudId": "7607d59e-650b-4c16-adcf-c19d17c915ac",
    "moduleKey": "sum-2-numbers-new-acion",
    "confluence": {
      "url": "https://mysite.atlassian.com/wiki/spaces/~65536301eb7512314748ebb489aba9d526b0f8/blog/2024/06/27/44662787/Holiday+in+Japan",
      "resourceType": "blog",
      "contentId": "44662787",
      "spaceKey": "~65536301eb7512314748ebb489aba9d526b0f8",
      "spaceId": "2064386"
    }
  }
}
*/
const ConfluenceDetailSchema = RovoProductDetailSchema.extend({
  contentId: z.string().min(1),
  spaceKey: z.string().min(1),
  spaceId: z.string().min(1),
});

export const RovoContextSchema = EventContextSchema.extend({
  jira: JiraIssueDetailSchema.optional(),
  confluence: ConfluenceDetailSchema.optional(),
});

export type RovoContext = z.infer<typeof RovoContextSchema>;
