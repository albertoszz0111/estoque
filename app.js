let produtos = [];

const API =
'https://stockcontrol-production-dd48.up.railway.app';


// ==========================
// CARREGAR
// ==========================

async function carregar() {

    try {

        const resposta =
            await fetch(`${API}/estoque`);

        produtos = await resposta.json();

        gerarCategorias();

        renderizar(produtos);

    } catch (erro) {

        console.log('Erro ao carregar produtos');

        console.log(erro);

    }

}

carregar();


// ==========================
// GERAR CATEGORIAS
// ==========================

function gerarCategorias() {

    const menu =
        document.querySelector('.menu');

    menu.innerHTML = `

        <button onclick="carregar()">
            TODOS
        </button>

    `;

    const categorias = [

        ...new Set(
            produtos.map(p => p.categoria)
        )

    ];

    categorias.forEach(categoria => {

        menu.innerHTML += `

            <button onclick="filtrar('${categoria}')">
                ${categoria}
            </button>

        `;

    });

}


// ==========================
// RENDERIZAR
// ==========================

function renderizar(listaProdutos) {

    const lista =
        document.getElementById('lista');

    lista.innerHTML = '';

    let baixoEstoque = 0;

    const categorias = new Set();

    listaProdutos.forEach(produto => {

        categorias.add(produto.categoria);

        if (produto.quantidade <= produto.minimo) {

            baixoEstoque++;

        }

        const card = document.createElement('div');

        card.className =

            produto.quantidade <= produto.minimo
            ? 'card baixo'
            : 'card';

        card.innerHTML = `

            <div class="card-top">

                <img
                    src="${produto.imagem}"
                    class="produto-img"
                >

            </div>

            <div class="info">

                <strong>${produto.nome}</strong>

                <p>Quantidade: ${produto.quantidade}</p>

                <p>Categoria: ${produto.categoria}</p>

                <p>Mínimo: ${produto.minimo}</p>

                <div class="botoes">

                    <button
                        class="btn-remove"
                        onclick="retirar(${produto.id})"
                    >
                        -
                    </button>

                    <button
                        class="btn-add"
                        onclick="adicionar(${produto.id})"
                    >
                        +
                    </button>

                </div>

            </div>

        `;

        lista.appendChild(card);

    });

    document.getElementById('total-produtos')
    .innerText = listaProdutos.length;

    document.getElementById('baixo-estoque')
    .innerText = baixoEstoque;

    document.getElementById('categorias')
    .innerText = categorias.size;

}


// ==========================
// FILTRAR
// ==========================

function filtrar(categoria) {

    const filtrados =

        produtos.filter(
            p => p.categoria === categoria
        );

    renderizar(filtrados);

}


// ==========================
// ADICIONAR
// ==========================

async function adicionar(id) {

    try {

        await fetch(

            `${API}/adicionar/${id}`,

            {
                method:'POST'
            }

        );

        carregar();

    } catch (erro) {

        console.log('Erro ao adicionar');

        console.log(erro);

    }

}


// ==========================
// RETIRAR
// ==========================

async function retirar(id) {

    try {

        const resposta = await fetch(

            `${API}/retirar/${id}`,

            {
                method:'POST'
            }

        );

        if (!resposta.ok) {

            alert('Produto sem estoque');

            return;

        }

        carregar();

    } catch (erro) {

        console.log('Erro ao retirar');

        console.log(erro);

    }

}


// ==========================
// PESQUISA
// ==========================

document

.getElementById('pesquisa')

.addEventListener('input', (e) => {

    const valor =

        e.target.value.toLowerCase();

    const filtrados =

        produtos.filter(produto =>

            produto.nome
            .toLowerCase()
            .includes(valor)

        );

    renderizar(filtrados);

});