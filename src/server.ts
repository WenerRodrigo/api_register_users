import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import dotenv from "dotenv";
import { createEvent } from "./routes/create.event";
import { registerForEvent } from "./routes/register-for-event";

dotenv.config();

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);

app.listen({ port: 3333 }).then(() => {
  console.log("Server is running on port 3333");
});
