// 1. inicia mapa
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);


// 2. função de conexões
function buildConnections(authors) {

    const connections = [];

    for (let i = 0; i < authors.length; i++) {
        for (let j = i + 1; j < authors.length; j++) {

            if (authors[i].movimento === authors[j].movimento) {
                connections.push([
                    authors[i].coords,
                    authors[j].coords
                ]);
            }

        }
    }

    return connections;
}


// 3. carregar dados
fetch("/autores/data/autores.json")
.then(res => res.json())
.then(authors => {

    // 🟢 CLUSTER (correto dentro do fetch)
    const markers = L.markerClusterGroup({

    iconCreateFunction: function(cluster){

        const count = cluster.getChildCount();

        let color = "#4CAF50";

        if(count > 10)
            color = "#FF9800";

        if(count > 30)
            color = "#F44336";

        return L.divIcon({
            html: `
                <div class="cluster-pin" style="background:${color}">
                    <span>${count}</span>
                </div>
            `,
            className:"",
            iconSize:[40,50]
        });

    }

    });

    // 🔵 adicionar markers
    authors.forEach(author => {

        if (!author.coords) return;

        const [lat, lng] = author.coords;

        const marker = L.marker([lat, lng]).bindPopup(`
            <b>${author.autor}</b><br>
            <i>${author.nacionalidade}</i><br><br>
            📖 ${author.obraFamosa}<br>
            🎭 ${author.movimento}<br><br>
            <a href="/autores/${author.autor.toLowerCase().replace(/ /g,'-')}">
                Ver perfil
            </a>
        `);

        markers.addLayer(marker);

    });

    map.addLayer(markers);


    // 🔴 conexões (linhas)
function buildStarConnections(authors) {

    const groups = {};

    authors.forEach(a => {
        if (!a.movimento) return;

        if (!groups[a.movimento]) {
            groups[a.movimento] = [];
        }

        groups[a.movimento].push(a);
    });

    const lines = [];

    Object.values(groups).forEach(group => {

        const center = group[0]; // autor principal

        for (let i = 1; i < group.length; i++) {
            lines.push([
                center.coords,
                group[i].coords
            ]);
        }

    });

    return lines;
}

const lines = buildStarConnections(authors);

lines.forEach(line => {
    L.polyline(line, {
        color: "#2563eb",
        weight: 2,
        opacity: 0.6
    }).addTo(map);
});

});