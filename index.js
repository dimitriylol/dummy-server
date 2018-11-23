const express = require("express");
const app = express();
const port = 5000;
const _ = require("underscore");

app.use((req, res, next) => {
    setTimeout(() => next(), _.random(5000))
})

app.use((req, res, next) => {
  if (typeof req.query.id !== "string") {
    next(
      new Error(
        `expected to have id GET parameter, like this: ${req.path}?id=smth`
      )
    );
  }
  next();
});

app.get("/svg", (req, res) => {
  const { width = 300, height = 100, id } = req.query;
  res.json({
    svg: `<svg>
        <rect width="${width}" height="${height}" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
        <text x="20" y="20" font-family="sans-serif" font-size="20px" fill="black">dummy svg for widget ${id}</text>
        </svg>`
  });
});

const randomIntFrom1to10 = () => _.random(1, 10);
const intArrayWithRandomLength = () => _.range(randomIntFrom1to10()).map((i) => i + 1)

app.get("/table", (req, res) => {
  const { id } = req.query;
  const head = intArrayWithRandomLength().map(i => `col${i}`);
  res.json({
    head,
    body: intArrayWithRandomLength().map(i =>
      Object.assign({}, ...head.map(key => ({ [key]: `${key}row${i}id${id}` })))
    )
  });
});

app.get("/text", (req, res) => {
    const { id } = req.query;
    res.json({ text: `id${id}WithRandomInt${randomIntFrom1to10()}`})
})

app.use((err, req, res, next) => {
  res.status(500).json({
    error: `error response for URL:${req.originalUrl};
err: ${err}`
  });
});

app.listen(port, () => console.log(`dummy server listening on port ${port}!`));
