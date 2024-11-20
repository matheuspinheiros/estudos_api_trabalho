document.getElementById('birdForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const region = document.getElementById('region').value;
    const apiKey = 'dcv2k62a4ts6'; // Chave

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

async function getBirdImage(birdName) {
    const unsplashKey = 'OFfLu6rFlVz1l3Grz01wG8jGTBJP6BDR0uz8wP9ShIc';
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${birdName}&client_id=${unsplashKey}`);
    const data = await response.json();
    return data.results.length > 0 ? data.results[0].urls.small : '';
}

async function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.length === 0) {
        resultsDiv.innerText = 'Nenhuma observação encontrada para a região especificada.';
        return;
    }

    for (const observation of data) {
        const birdElement = document.createElement('div');
        birdElement.classList.add('observation');
        
        // pega a imagem dos passáros 
        const imageUrl = await getBirdImage(observation.comName);

        birdElement.innerHTML = `
            <h3>${observation.comName}</h3>
            <p>Nome Científico: ${observation.sciName}</p>
            <p>Local: ${observation.locName}</p>
            <p>Data: ${observation.obsDt}</p>
            ${imageUrl ? `<img src="${imageUrl}" alt="${observation.comName}" />` : ''}
        `;
        resultsDiv.appendChild(birdElement);
    }
}