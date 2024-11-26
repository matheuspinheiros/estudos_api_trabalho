// adiciono a funcionalidade, consome a api e faz o processamento dos dados da mesma.
// captura do formulário
document.getElementById('birdForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const region = document.getElementById('region').value; // variavel da região
    const apiKey = 'dcv2k62a4ts6'; // Chave da api

    // sempre uso Try Catch para tratamento de erros
    try {
        // envia uma solicitação para a API do eBird usando a região digitada
        const response = await fetch(`https://api.ebird.org/v2/data/obs/${region}/recent`, {
            headers: {
                'X-eBirdApiToken': apiKey
            }
        });

        if (!response.ok) throw new Error('Erro na solicitação');

        // Processamento dos dados, Converto a resposta da API em JSON e envio os dados para a função
        const data = await response.json(); // variaveis com os dados
        displayResults(data); // função para mostrar os resultados
    } catch (error) {
        console.error(error);
        document.getElementById('results').innerText = 'Erro ao buscar observações.';
    }
});

// busca de imagens na Api UNPLASH
// procura imagens relacionadas ao nome do passáro e retorna o link da imagem
async function getBirdImage(birdName) {
    const unsplashKey = 'OFfLu6rFlVz1l3Grz01wG8jGTBJP6BDR0uz8wP9ShIc'; // chave da api
    // fetch para consumir a api com o endereço endpoint
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${birdName}&client_id=${unsplashKey}`);
    const data = await response.json();
    return data.results.length > 0 ? data.results[0].urls.small : '';
}


// mostra os resultados
async function displayResults(data) {
    const resultsDiv = document.getElementById('results');  // div para resultados
    resultsDiv.innerHTML = ''; // antes de exibir novos resultados ele limpa todo o conteudo

    // if caso data esteja vazio, uma mensagem é exibida e a função encerra com o return
    if (data.length === 0) {
        resultsDiv.innerText = 'Nenhuma observação encontrada para a região especificada.';
        return;
    }

    // Loop para mostrar cada elemento de 'data', para cada elemento ele cria uma div que é estilizada
    // na classe CSS observation, facilitando estilização dos resultados
    for (const observation of data) {
        const birdElement = document.createElement('div');
        birdElement.classList.add('observation');

        // o fetch pode falhar causando um problema no carregamento das imagens, o Try lança um erro
        // o Catch garante que o erro não interrompa a execução do restante do sistema.
        try {
            // Tenta obter a imagem do Unsplash com a função criada acima
            const imageUrl = await getBirdImage(observation.comName); // variavel que armazena a imagem buscando pelo nome
            
            // monta o conteudo do html
            // as informações da ave são formatadas como HTML
            birdElement.innerHTML = `
                <h3>${observation.comName}</h3>
                <p>Nome Científico: ${observation.sciName}</p>
                <p>Local: ${observation.locName}</p>
                <p>Data: ${observation.obsDt}</p>
                ${
                    imageUrl 
                        ? `<img src="${imageUrl}" alt="${observation.comName}" />`  // a imagem será exibida
                        : '<p>Imagem não encontrada.</p>' // se não achou imagem não sera exibida
                }
            `;
        } catch (error) {
            // erro ao achar a imagem e monta o html novamento porém sem a imagem
            console.error(`Erro ao buscar imagem para ${observation.comName}:`, error);
            birdElement.innerHTML = `
                <h3>${observation.comName}</h3>
                <p>Nome Científico: ${observation.sciName}</p>
                <p>Local: ${observation.locName}</p>
                <p>Data: ${observation.obsDt}</p>
                <p>Imagem não disponível.</p>
            `;
        }

        // cada elemento com informações e imagem da ave é adicionado ao container #results
        resultsDiv.appendChild(birdElement);
    }
}