import { getPort } from "./src/helpers/env.js";
import { httpServer } from "./src/http_server/index.js";

const HTTP_PORT = getPort();

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
