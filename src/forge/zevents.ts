import * as z from "zod";

const UniquelyIdentifiedSchema = z.object({
  id: z.string().min(1),
});

const EnabledSchema = z.object({
  enabled: z.boolean(),
});

export const EventContextSchema = z.object({
  cloudId: z.string().uuid(), // v4: z.uuid()
  moduleKey: z.string().min(1),
  userAccess: EnabledSchema.optional(),
});

export type EventContext = z.infer<typeof EventContextSchema>;

const AppSchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  name: z.string().min(1).optional(),
  ownerAccountId: z.string().min(1).optional(),
});

export const CommonEventSchema = z.object({
  context: EventContextSchema,
  app: AppSchema.optional(),
  environment: UniquelyIdentifiedSchema.optional(),
  // Undocumented attributes
  eventType: z.string().optional(),
  selfGenerated: z.boolean().optional(),
  contextToken: z.string().optional(),
});

export type CommonEvent = z.infer<typeof CommonEventSchema>;
