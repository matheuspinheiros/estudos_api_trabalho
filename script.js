document.getElementById('birdForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const region = document.getElementById('region').value;
    const apiKey = 'dcv2k62a4ts6'; // Substitua com sua chave eBird

    try {
        const response = await fetch(`https://api.ebird.org/v2/data/obs/${region}/recent`, {
            headers: {
                'X-eBirdApiToken': apiKey
            }
        });

        if (!response.ok) throw new Error('Erro na solicitação');

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error(error);
        document.getElementById('results').innerText = 'Erro ao buscar observações.';
    }
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.length === 0) {
        resultsDiv.innerText = 'Nenhuma observação encontrada para a região especificada.';
        return;
    }

    data.forEach(observation => {
        const birdElement = document.createElement('div');
        birdElement.classList.add('observation');
        birdElement.innerHTML = `
            <h3>${observation.comName}</h3>
            <p>Nome Científico: ${observation.sciName}</p>
            <p>Local: ${observation.locName}</p>
            <p>Data: ${observation.obsDt}</p>
        `;
        resultsDiv.appendChild(birdElement);
    });
}