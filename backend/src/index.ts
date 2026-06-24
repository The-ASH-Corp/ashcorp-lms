import app from "./server";
import { ENV } from "./shared/env/ENV";
import { connectDB } from "./shared/db/connectDB";

if (!ENV.PORT) {
  throw new Error("PORT is not defined");
}

(async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.info(`Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to connection error:", error);
    process.exit(1);
  }
})();