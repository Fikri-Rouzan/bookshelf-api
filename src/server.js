import Hapi from "@hapi/hapi";
import routes from "./routes.js";

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  server.route({
    method: "GET",
    path: "/",
    handler: () => {
      return { message: "Bookshelf API is running! 🚀" };
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
