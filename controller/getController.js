// -----> core module
const path = require(`path`);

module.exports = (_req, res) => {
  res
    .set(`Content-Type`, `text/html`)
    .status(200)
    .sendFile(path.join(__dirname, `../views/index.html`), (err) => {
      if (err) res.status(500).send(`<h1>Something went wrong</h1>`);
    });
};
