import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        body: z.object({
          title: z.string().min(1).max(255),
          details: z.string().min(1).max(255),
          maximumAttendees: z.number().int().positive(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body;

      const slug = generateSlug(title);

      const eventWithSameSLug = await prisma.event.findFirst({
        where: {
          slug,
        },
      });

      if (eventWithSameSLug !== null) {
        throw new Error("Event with same slug already exists");
      }

      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      });

      return reply.status(201).send({ eventId: event.id });
    }
  );
}
