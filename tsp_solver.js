
function getEmeraldParams() {
    const A = parseFloat(document.getElementById('paramA')?.value) || 0.003;
    const s = parseFloat(document.getElementById('paramS')?.value) || 0.1;
    const N = parseInt(document.getElementById('paramN')?.value) || 3;
    console.log(`🎛️ Parâmetros Esmeralda: A=${A}, s=${s}, N=${N}`);
    return { A, s, N };
}

function emeraldPerfectRefinedValue(n, phi = Math.PI * (3 - Math.sqrt(5))) {
    const { A, s, N } = getEmeraldParams();
    let E_primal = A * Math.sin((2 * Math.PI * n) / phi);
    let E_primordial = 0;
    for (let k = 1; k <= N; k++) {
        E_primordial += A * Math.sin((2 * Math.PI * k * n) / Math.pow(phi, k));
    }
    const Rn = Math.log(n);
    const smooth = 1 + s * Math.sin((2 * Math.PI * n) / (phi * s));
    const E = (E_primal + E_primordial) * Rn * (n / Math.log(n + 1)) * smooth;
    return E;
}













function solveTSPHarmonic(cities) {
    const center = cities.reduce((acc, c) => ({ x: acc.x + c.x, y: acc.y + c.y }), { x: 0, y: 0 });
    center.x /= cities.length;
    center.y /= cities.length;

    return [...cities].sort((a, b) => {
        const aVal = emeraldPerfectRefinedValue(a.id);
        const bVal = emeraldPerfectRefinedValue(b.id);
        if (!isFinite(aVal) || !isFinite(bVal)) return 0;
        const angleA = Math.atan2(a.y - center.y, a.x - center.x);
        const angleB = Math.atan2(b.y - center.y, b.x - center.x);
        return aVal - bVal; // ordenação harmônica esmeralda
    });
}

function totalCost(path) {
    let cost = 0;
    for (let i = 0; i < path.length - 1; i++) {
        cost += euclideanDistance(path[i], path[i + 1]);
    }
    cost += euclideanDistance(path[path.length - 1], path[0]);
    return cost;
}

function twoOpt(route) {
    let best = route;
    let improved = true;
    while (improved) {
        improved = false;
        for (let i = 1; i < best.length - 1; i++) {
            for (let j = i + 1; j < best.length; j++) {
                const newRoute = best.slice(0, i).concat(best.slice(i, j + 1).reverse(), best.slice(j + 1));
                if (totalCost(newRoute) < totalCost(best)) {
                    best = newRoute;
                    improved = true;
                }
            }
        }
    }
    return best;
}

function threeOpt(route) {
    const n = route.length;
    let improved = true;
    let best = route.slice();

    while (improved) {
        improved = false;
        for (let i = 0; i < n - 2; i++) {
            for (let j = i + 1; j < n - 1; j++) {
                for (let k = j + 1; k < n; k++) {
                    const a = best.slice(0, i);
                    const b = best.slice(i, j);
                    const c = best.slice(j, k);
                    const d = best.slice(k);

                    const options = [
                        [...a, ...b, ...c, ...d],
                        [...a, ...b.reverse(), ...c, ...d],
                        [...a, ...b, ...c.reverse(), ...d],
                        [...a, ...b.reverse(), ...c.reverse(), ...d],
                        [...a, ...c, ...b, ...d],
                        [...a, ...c.reverse(), ...b, ...d]
                    ];

                    for (const opt of options) {
                        if (totalCost(opt) < totalCost(best)) {
                            best = opt;
                            improved = true;
                        }
                    }
                }
            }
        }
    }
    return best;
}

function solveTSPHarmonicAndRefined(cities) {
    const harmonic = solveTSPHarmonic(cities);
    const refined2Opt = twoOpt(harmonic);
    console.log("🔁 2-opt finalizado. Iniciando 3-opt...");
    const refined3Opt = threeOpt(refined2Opt);
    console.log("✅ 3-opt aplicado. Refinamento concluído.");
    return refined3Opt;
}
