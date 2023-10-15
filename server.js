const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('unhandled exception', 'Shutting down');
  console.error(err.name, err.message);

  process.exit(1);
});
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('connection secured');
  });
const port = process.env.PORT || 1305;

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log('unhandled Rejection', 'Shutting down');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
