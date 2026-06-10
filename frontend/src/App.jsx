import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [edges, setEdges] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");

      const edgeArray = edges
        .split("\n")
        .map((e) => e.trim())
        .filter(Boolean);

      const response = await axios.post(
        "https://sit-graph-challenge.onrender.com/api/graph",
        {
          edges: edgeArray,
        }
      );

      setResult(response.data);
    } catch (err) {
      setError("Unable to process graph.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="card">

        <h1>Graph Hierarchy Processor</h1>

        <p className="subtitle">
          Analyze graph hierarchies, cycles, duplicates and invalid entries
        </p>

        <textarea
          value={edges}
          onChange={(e) => setEdges(e.target.value)}
          placeholder={"A->B\nA->C\nB->D"}
        />

        <button onClick={handleSubmit}>
          Process Graph
        </button>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {result && (
          <>
            <div className="summary">

              <div className="summary-card">
                <h3>Total Trees</h3>
                <p>{result.summary.total_trees}</p>
              </div>

              <div className="summary-card">
                <h3>Total Cycles</h3>
                <p>{result.summary.total_cycles}</p>
              </div>

              <div className="summary-card">
                <h3>Largest Root</h3>
                <p>{result.summary.largest_tree_root}</p>
              </div>

            </div>

            <h2>Hierarchies</h2>

            <div className="hierarchy-grid">

              {result.hierarchies.map((item, index) => (
                <div className="hierarchy-card" key={index}>

                  <h3>Root: {item.root}</h3>

                  {item.has_cycle ? (
                    <p className="cycle">
                      Cycle Detected
                    </p>
                  ) : (
                    <>
                      <p>Depth: {item.depth}</p>

                      <pre>
                        {JSON.stringify(item.tree, null, 2)}
                      </pre>
                    </>
                  )}

                </div>
              ))}

            </div>

            <div className="bottom-grid">

              <div className="info-card">
                <h3>Invalid Entries</h3>

                {result.invalid_entries.length ? (
                  <ul>
                    {result.invalid_entries.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>None</p>
                )}
              </div>

              <div className="info-card">
                <h3>Duplicate Edges</h3>

                {result.duplicate_edges.length ? (
                  <ul>
                    {result.duplicate_edges.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>None</p>
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;