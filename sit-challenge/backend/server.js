const express = require("express");
const cors = require("cors");

const { processGraph } = require("./graphService");

const app = express();

app.use(cors());
app.use(express.json());

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
app.get("/", (req, res) => {
  res.json({
    status: "Backend Running",
    api: "/api/graph"
  });
});

app.listen(5001, () => {
    console.log("Server running on port 5001");
});