// services/routing.js - Dijkstra Graph Routing with Obstacle/Flood Avoidance

/**
 * Node graph representing critical transport arteries, base stations, hospitals, and shelters
 */
const roadNetwork = {
  nodes: {
    "BASE_NDRF": { name: "NDRF 1st Battalion HQ", lat: 26.1750, lng: 91.7450 },
    "JCT_A": { name: "Paltan Bazar Flyover Junction", lat: 26.1820, lng: 91.7510 },
    "JCT_B": { name: "Guwahati Club Crossing", lat: 26.1890, lng: 91.7580 },
    "INC_RIVER": { name: "Uzan Bazar Flood Incident Spot", lat: 26.1950, lng: 91.7560 },
    "SHELTER_SARUSAJAI": { name: "Sarusajai Regional Shelter", lat: 26.1150, lng: 91.7650 },
    "HOSPITAL_CIVIL": { name: "Guwahati Medical College & Hospital", lat: 26.1550, lng: 91.7700 },
    "JCT_BYPASS": { name: "Elevated Ring Road Bypass", lat: 26.1600, lng: 91.7200 },
    "JCT_NORTH": { name: "Saraighat North River Bank", lat: 26.1280, lng: 91.6850 }
  },
  edges: [
    // [from, to, distanceKm, isBlocked, normalSpeedKmh]
    ["BASE_NDRF", "JCT_A", 1.8, false, 40],
    ["JCT_A", "JCT_B", 1.4, true, 30], // BLOCKED by flood water (Simulated real obstruction)
    ["JCT_B", "INC_RIVER", 1.1, false, 25],
    ["BASE_NDRF", "JCT_BYPASS", 3.2, false, 55],
    ["JCT_BYPASS", "HOSPITAL_CIVIL", 4.1, false, 50],
    ["JCT_BYPASS", "INC_RIVER", 4.8, false, 45], // Alternative safe corridor
    ["HOSPITAL_CIVIL", "SHELTER_SARUSAJAI", 5.0, false, 40],
    ["BASE_NDRF", "SHELTER_SARUSAJAI", 7.2, false, 45],
    ["JCT_A", "HOSPITAL_CIVIL", 3.5, false, 35]
  ]
};

/**
 * Dijkstra shortest path implementation
 */
export function calculateOptimalRescueRoute(startNode = "BASE_NDRF", endNode = "INC_RIVER", avoidBlocked = true) {
  const nodes = Object.keys(roadNetwork.nodes);
  const distances = {};
  const previous = {};
  const unvisited = new Set(nodes);

  nodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });

  distances[startNode] = 0;

  // Build adjacency list
  const adj = {};
  nodes.forEach(n => (adj[n] = []));

  roadNetwork.edges.forEach(([u, v, dist, blocked, speed]) => {
    // If avoiding blocked roads, assign near-infinite penalty or exclude
    const weight = avoidBlocked && blocked ? Infinity : dist;
    adj[u].push({ node: v, weight, dist, blocked, speed });
    adj[v].push({ node: u, weight, dist, blocked, speed });
  });

  while (unvisited.size > 0) {
    let curr = null;
    let minD = Infinity;

    for (const node of unvisited) {
      if (distances[node] < minD) {
        minD = distances[node];
        curr = node;
      }
    }

    if (!curr || distances[curr] === Infinity || curr === endNode) {
      break;
    }

    unvisited.delete(curr);

    for (const neighbor of adj[curr]) {
      if (!unvisited.has(neighbor.node)) continue;
      const alt = distances[curr] + neighbor.weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = { from: curr, ...neighbor };
      }
    }
  }

  // Reconstruct path
  const path = [];
  let step = endNode;
  let totalDistanceKm = 0;
  let hasBlockedSegment = false;

  while (step) {
    path.unshift(step);
    const prevStep = previous[step];
    if (prevStep) {
      totalDistanceKm += prevStep.dist;
      if (prevStep.blocked) hasBlockedSegment = true;
      step = prevStep.from;
    } else {
      break;
    }
  }

  const avgSpeed = 38; // km/h realistic emergency transit
  const travelTimeMinutes = Math.round((totalDistanceKm / avgSpeed) * 60) + 4; // 4 min buffer

  // Calculate coordinates for mapping
  const routeCoordinates = path.map(nodeId => {
    const node = roadNetwork.nodes[nodeId];
    return { id: nodeId, name: node?.name, lat: node?.lat, lng: node?.lng };
  });

  return {
    algorithm: "Dijkstra Priority Graph Pathfinding",
    startNode: roadNetwork.nodes[startNode],
    endNode: roadNetwork.nodes[endNode],
    pathNodeIds: path,
    routeCoordinates,
    totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
    estimatedTravelTimeMinutes: travelTimeMinutes,
    avoidedBlockedRoads: avoidBlocked,
    hasBlockedSegment,
    blockedRoadIdentified: "JCT_A to JCT_B (Paltan Bazar - Guwahati Club Corridor underwater)",
    status: path.length > 1 ? "SUCCESS" : "NO_PATH_AVAILABLE"
  };
}
