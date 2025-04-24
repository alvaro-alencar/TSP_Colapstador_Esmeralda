
document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('paramA').addEventListener('input', () => handleFile({ target: { files: [window.currentTSPFile] } }));
document.getElementById('paramS').addEventListener('input', () => handleFile({ target: { files: [window.currentTSPFile] } }));
document.getElementById('paramN').addEventListener('input', () => handleFile({ target: { files: [window.currentTSPFile] } }));


function handleFile(event) {
    const file = event.target.files[0]; window.currentTSPFile = file;
    const reader = new FileReader();

    reader.onload = function(e) {
        console.log("📄 Arquivo carregado com sucesso.");
        const content = e.target.result;
        const cities = parseTSPLIB(content);
        console.log(`📌 ${cities.length} cidades carregadas do arquivo.`);

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const minX = Math.min(...cities.map(c => c.x));
        const minY = Math.min(...cities.map(c => c.y));
        const maxX = Math.max(...cities.map(c => c.x));
        const maxY = Math.max(...cities.map(c => c.y));

        const canvasSize = canvas.width;
        const padding = 50;

        const scaleX = (canvasSize - 2 * padding) / (maxX - minX);
        const scaleY = (canvasSize - 2 * padding) / (maxY - minY);
        const scale = Math.min(scaleX, scaleY);

        function transform(coord) {
            return {
                x: padding + (coord.x - minX) * scale,
                y: padding + (coord.y - minY) * scale
            };
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("🧼 Canvas limpo. Iniciando desenho das cidades...");

        for (const city of cities) {
            const pos = transform(city);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = "#00ffcc";
            ctx.fill();
            ctx.fillText(city.id, pos.x + 5, pos.y - 5);
        }

        console.log("✅ Cidades desenhadas. Calculando rota inicial (colapsador angular)...");
        const harmonic = solveTSPHarmonic(cities);
        console.log("🔁 Aplicando refinamento 2-opt...");
        const solution = twoOpt(harmonic);
        console.log("🧠 Rota otimizada com 2-opt.");

        ctx.beginPath();
        const firstPos = transform(solution[0]);
        ctx.moveTo(firstPos.x, firstPos.y);
        for (let i = 1; i < solution.length; i++) {
            const pos = transform(solution[i]);
            ctx.lineTo(pos.x, pos.y);
        }
        ctx.lineTo(firstPos.x, firstPos.y);
        ctx.strokeStyle = "#ff00ff";
        ctx.lineWidth = 2;
        ctx.stroke();
        console.log("🖋️ Caminho desenhado.");

        const cost = totalPathCost(solution);
        console.log(`💰 Custo total estimado da rota: ${cost.toFixed(2)}`);
        document.getElementById('output').innerText = `Custo estimado da rota: ${cost.toFixed(2)}`;
    };

    reader.readAsText(file);
}


function exportCSV() {
    const A = parseFloat(document.getElementById('paramA')?.value) || 0.003;
    const s = parseFloat(document.getElementById('paramS')?.value) || 0.1;
    const N = parseInt(document.getElementById('paramN')?.value) || 3;
    const costText = document.getElementById('output').innerText;
    const cost = costText.replace(/[^\d\.,]/g, '').replace(',', '.');

    const csvContent = `A,s,N,Custo\n${A},${s},${N},${cost}\n`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "resultado_tsp.csv");
    a.click();
}





function autoExplore() {
    const results = [["A", "s", "N", "Custo"]];
    const file = window.currentTSPFile;
    const A_vals = [0.003];  // Focado no melhor já encontrado
    const s_vals = [0.1, 0.2, 0.29];
    const N_vals = [1, 2, 3, 4, 5, 6];

    let index = 0;
    let best = { A: null, s: null, N: null, cost: Infinity };

    function nextTest() {
        if (index >= A_vals.length * s_vals.length * N_vals.length) {
            // Exportar CSV
            const csv = results.map(r => r.join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "autoexplore_results.csv";
            a.click();

            // Exibir melhor resultado
            alert(`🧠 Melhor configuração: A=${best.A}, s=${best.s}, N=${best.N} → Custo: ${best.cost}`);
            return;
        }

        const i = Math.floor(index / (s_vals.length * N_vals.length));
        const j = Math.floor((index / N_vals.length) % s_vals.length);
        const k = index % N_vals.length;

        const A = A_vals[i];
        const s = s_vals[j];
        const N = N_vals[k];

        document.getElementById("paramA").value = A;
        document.getElementById("paramS").value = s;
        document.getElementById("paramN").value = N;

        handleFile({ target: { files: [file] } });

        setTimeout(() => {
            const costText = document.getElementById('output').innerText;
            const cost = parseFloat(costText.replace(/[^\d\.,]/g, '').replace(',', '.'));

            if (cost && cost < best.cost) {
                best = { A, s, N, cost };
            }

            results.push([A, s, N, cost]);
            index++;
            nextTest();
        }, 500); // tempo reduzido para otimizar varredura
    }

    nextTest();
}
