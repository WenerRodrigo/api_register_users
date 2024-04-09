import fastify from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { generateSlug } from "./utils/generate-slug";
import dotenv from "dotenv";

dotenv.config();

const app = fastify();

const prisma = new PrismaClient({
  log: ["query"],
});

app.post("/events", async (request, reply) => {
  const createEventSchema = z.object({
    title: z.string().min(5),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive(),
  });

  const data = createEventSchema.parse(request.body);

  const slug = generateSlug(data.title);

  const event = await prisma.event.create({
    data: {
      title: data.title,
      details: data.details,
      maximumAttendees: data.maximumAttendees,
      slug,
    },
  });

  return reply.status(201).send({ eventId: event.id });
});

app.listen({ port: 3333 }).then(() => {
  console.log("Server is running on port 3333");
});
