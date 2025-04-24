function parseTSPLIB(content) {
    const lines = content.split('\n');
    const coords = [];
    let reading = false;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === 'NODE_COORD_SECTION') {
            reading = true;
            continue;
        }
        if (trimmed === 'EOF') break;

        if (reading && trimmed.match(/^\d+/)) {
            const [id, x, y] = trimmed.split(/\s+/).map(Number);
            coords.push({ id, x, y });
        }
    }
    return coords;
}
