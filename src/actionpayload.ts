import * as z from "zod";
import { CommonEventSchema } from "./forge/zevents";
import { RovoContextSchema } from "./rovo/zaction";

export const CreatePagePayloadSchema = CommonEventSchema.extend({
  spaceId: z.string().min(1),
  parentId: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  status: z.string().optional(),
  context: RovoContextSchema,
});

export const UpdatePagePayloadSchema = CommonEventSchema.extend({
  pageId: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  status: z.string().optional(),
  context: RovoContextSchema,
});

export const AddCommentPayloadSchema = CommonEventSchema.extend({
  comment: z.string().min(1),
  pageId: z.string().min(1),
  context: RovoContextSchema,
});

export type CreatePagePayload = z.infer<typeof CreatePagePayloadSchema>;
export type UpdatePagePayload = z.infer<typeof UpdatePagePayloadSchema>;
export type AddCommentPayload = z.infer<typeof AddCommentPayloadSchema>;
