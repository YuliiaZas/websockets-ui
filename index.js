import { httpServer } from "./src/http_server/index.js";

const PORT = process.env.PORT;

console.log(`Start static http server on the ${PORT} port!`);
httpServer.listen(PORT);
