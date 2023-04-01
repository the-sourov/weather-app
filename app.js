// -----> third party module
const express = require(`express`);

// -----> own module
const getController = require(`./controller/getController.js`);
const postController = require(`./controller/postController.js`);
const notFoundController = require(`./controller/notFoundController.js`);

// -----> initializing express
const app = express();

// -----> setting up middelware for body data
app.use(express.json());

// -----> serving static files
app.use(express.static(`public`));

// -----> declaring routes
app.route(`/`).get(getController).post(postController);
app.route(`*`).all(notFoundController);

app.listen(100, () => {
  console.log(`Server is running on port 100 🔥.`);
});
