import fastify from "fastify";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { PrismaClient } from "@prisma/client";
import { generateSlug } from "./utils/generate-slug";
import dotenv from "dotenv";

dotenv.config();

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const prisma = new PrismaClient({
  log: ["query"],
});

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
        })
      }
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

app.listen({ port: 3333 }).then(() => {
  console.log("Server is running on port 3333");
});
