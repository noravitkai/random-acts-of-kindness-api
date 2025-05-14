import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import cors from "cors";
import routes from "./routes";
import { connect } from "./repository/database";
import { setupDocs } from "./util/documentation";

dotenvFlow.config();

const app: Application = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "auth-token",
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
    ],
  })
);
app.options("*", cors());

app.use(express.json());

setupDocs(app);

app.use("/api", routes);

export async function startServer() {
  await connect();

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, () => {
    console.log(
      `🚀 Random Acts of Kindness API is running at http://localhost:${PORT}/api.`
    );
  });
}
