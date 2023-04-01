// -----> core module
const path = require(`path`);

module.exports = (_req, res) => {
  res
    .set(`Content-Type`, `text/html`)
    .status(404)
    .sendFile(path.join(__dirname, `../views/notFound.html`), (err) => {
      if (err) res.send(`<h1>Something went wrong</h1>`);
    });
};
