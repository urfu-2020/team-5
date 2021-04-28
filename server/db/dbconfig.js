const dbconfig = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE_NAME,
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    instanceName: process.env.DATABASE_INSTANCE_NAME
  },
  port: process.env.DATABASE_SERVER_PORT
};

module.exports = dbconfig;
