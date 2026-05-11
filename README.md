# Smart Campus Navigation System

A full-stack web application built for a Design and Analysis of Algorithms (DAA) project to visualize and compare shortest path algorithms.

## Features

- **Interactive Graph Builder**: Add nodes, create edges, and block paths dynamically on a campus map.
- **Shortest Path Algorithms**:
  - **Dijkstra's Algorithm** (Min-Heap implementation, O((V+E)log V))
  - **Breadth-First Search (BFS)** for unweighted graphs (O(V+E))
  - **Bellman-Ford Algorithm** with negative cycle detection (O(V×E))
- **Real-time Visualization**: Step-by-step and auto-play animation of algorithm execution.
- **Comparison Dashboard**: Run all algorithms simultaneously and compare execution time, nodes visited, and distance.
- **Modern UI**: Dark/Light mode, glassmorphism design, and interactive Cytoscape.js canvas.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Cytoscape.js, Chart.js
- **Backend**: Node.js, Express.js
- **Architecture**: REST API

## Project Structure

```text
/DAAproject
├── frontend/           # React application (Vite)
│   ├── src/
│   │   ├── components/ # UI Components (GraphCanvas, Controls, etc.)
│   │   ├── pages/      # Main application pages
│   │   ├── utils/      # Helpers for graph math and API
│   │   └── index.css   # Tailwind + Custom Design System
│   └── package.json
└── backend/            # Express server
    ├── algorithms/     # Dijkstra, BFS, Bellman-Ford implementations
    ├── routes/         # API Endpoints
    ├── data/           # Sample campus graph
    ├── server.js
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### 1. Start the Backend Server

```bash
cd backend
npm install
npm start
```
The backend server will run on `http://localhost:5000`.

### 2. Start the Frontend Application

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Usage Instructions

1. **Load Sample Graph**: Click "Load Campus Graph" to start with a pre-built 8-node campus map.
2. **Add Nodes**: Click anywhere on the empty canvas to create a new location.
3. **Add Edges**: Click "Add Edge Mode", then click two nodes consecutively to connect them. Enter the weight when prompted.
4. **Modify/Block Edges**: Right-click on any edge to block it (simulate road closure) or change its weight (simulate traffic).
5. **Find Path**: Select a Source, Destination, and Algorithm, then click "Find Shortest Path".
6. **Visualize**: Use the playback controls (Step or Auto mode) in the bottom right to watch the algorithm traverse the graph.
7. **Compare**: Click "Compare All Algorithms" to see a performance chart and table.
