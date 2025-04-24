function euclideanDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function totalPathCost(path) {
    let cost = 0;
    for (let i = 0; i < path.length - 1; i++) {
        cost += euclideanDistance(path[i], path[i + 1]);
    }
    cost += euclideanDistance(path[path.length - 1], path[0]);
    return cost;
}
