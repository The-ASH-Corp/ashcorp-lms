import app from "./server";
import { ENV } from "./shared/env/ENV";


if (!ENV.PORT) {
  throw new Error("PORT is not defined");
}


app.listen(ENV.PORT, () => {
  console.info(`Server running on port ${ENV.PORT}`);
});