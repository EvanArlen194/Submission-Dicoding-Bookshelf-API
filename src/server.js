const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const createServer = async () => {
  const server = Hapi.server({
    port: 9000,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  return server;
};

const startServer = async () => {
  try {
    const server = await createServer();
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
  } catch (err) {
    console.error("Error starting server: ", err);
    process.exit(1);
  }
};

startServer();
