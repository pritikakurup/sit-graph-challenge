function getComponents(nodes, graph) {
    const undirected = {};

    for (const node of nodes) {
        undirected[node] = [];
    }

    for (const parent in graph) {
        for (const child of graph[parent]) {
            undirected[parent].push(child);
            undirected[child].push(parent);
        }
    }

    const visited = new Set();
    const components = [];

    for (const node of nodes) {
        if (visited.has(node)) continue;

        const stack = [node];
        const component = [];

        visited.add(node);

        while (stack.length) {
            const curr = stack.pop();
            component.push(curr);

            for (const next of undirected[curr]) {
                if (!visited.has(next)) {
                    visited.add(next);
                    stack.push(next);
                }
            }
        }

        components.push(component);
    }

    return components;
}

function hasCycle(node, graph, visited, pathVisited) {
    visited.add(node);
    pathVisited.add(node);

    for (const child of graph[node] || []) {
        if (!visited.has(child)) {
            if (hasCycle(child, graph, visited, pathVisited)) {
                return true;
            }
        } else if (pathVisited.has(child)) {
            return true;
        }
    }

    pathVisited.delete(node);
    return false;
}

function buildTree(node, graph) {
    const obj = {};

    for (const child of graph[node] || []) {
        obj[child] = buildTree(child, graph);
    }

    return obj;
}

function getDepth(node, graph) {
    const children = graph[node] || [];

    if (children.length === 0) {
        return 1;
    }

    return 1 + Math.max(...children.map(child => getDepth(child, graph)));
}

function processGraph(edges) {
    const invalid_entries = [];
    const duplicate_edges = [];

    const regex = /^[A-Z]->[A-Z]$/;

    const seenEdges = new Set();
    const duplicateSeen = new Set();

    const graph = {};
    const nodes = new Set();

    const childParent = new Map();
    const allChildren = new Set();

    for (let edge of edges) {
        edge = String(edge).trim();

        if (!regex.test(edge)) {
            invalid_entries.push(edge);
            continue;
        }

        const [parent, child] = edge.split("->");

        if (parent === child) {
            invalid_entries.push(edge);
            continue;
        }

        if (seenEdges.has(edge)) {
            if (!duplicateSeen.has(edge)) {
                duplicate_edges.push(edge);
                duplicateSeen.add(edge);
            }
            continue;
        }

        seenEdges.add(edge);

        // Add nodes first
        nodes.add(parent);
        nodes.add(child);

        if (!graph[parent]) {
            graph[parent] = [];
        }

        // Multi-parent rule
        if (childParent.has(child)) {
            continue;
        }

        childParent.set(child, parent);

        graph[parent].push(child);

        allChildren.add(child);
    }

    // Ensure every node exists in graph
    for (const node of nodes) {
        if (!graph[node]) {
            graph[node] = [];
        }
    }

    const components = getComponents(nodes, graph);

    const hierarchies = [];

    let total_trees = 0;
    let total_cycles = 0;

    let largestDepth = 0;
    let largest_tree_root = "";

    for (const component of components) {
        const visited = new Set();
        const pathVisited = new Set();

        let cycle = false;

        for (const node of component) {
            if (!visited.has(node)) {
                if (hasCycle(node, graph, visited, pathVisited)) {
                    cycle = true;
                    break;
                }
            }
        }

        let roots = component.filter(node => !allChildren.has(node));

        let root;

        if (roots.length > 0) {
            roots.sort();
            root = roots[0];
        } else {
            root = [...component].sort()[0];
        }

        if (cycle) {
            total_cycles++;

            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
        } else {
            const tree = {
                [root]: buildTree(root, graph)
            };

            const depth = getDepth(root, graph);

            total_trees++;

            if (
                depth > largestDepth ||
                (
                    depth === largestDepth &&
                    (
                        largest_tree_root === "" ||
                        root < largest_tree_root
                    )
                )
            ) {
                largestDepth = depth;
                largest_tree_root = root;
            }

            hierarchies.push({
                root,
                tree,
                depth
            });
        }
    }

    return {
        user_id: "pritikakurup_20051106",
        email_id: "pritika.kurup.btech2023@sitpune.edu.in",
        enrollment_number: "23070122167",

        hierarchies,

        invalid_entries,

        duplicate_edges,

        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
}

module.exports = { processGraph };