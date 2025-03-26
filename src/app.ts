import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import routes from "./routes";
import { connect } from "./repository/database";

dotenvFlow.config();

const app: Application = express();

app.use(express.json());
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
