const express = require("express");
const cors = require("cors");

const { processGraph } = require("./graphService");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "Backend Running",
    api: "/api/graph"
  });
});

app.post("/api/graph", (req, res) => {
  console.log("Request received");
  console.log(req.body);

  try {
    const result = processGraph(req.body.edges || []);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});