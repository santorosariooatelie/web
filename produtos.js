// ========== DADOS DOS PRODUTOS ==========
let produtos = [];

// ========== ESTADO DA APLICAÇÃO ==========
let produtosFiltrados = [];
let filtroSanto = '';
let filtroMaterial = '';
let filtroCor = '';
let produtoEmFoco = null;

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  carregarProdutosDoSheet();
});

// ========== CARREGAR PRODUTOS DA API ==========
async function carregarProdutosDoSheet() {
  try {
    const response = await fetch(CONFIG.GOOGLE_SHEET_URL);
    const dados = await response.json();
    
    // Mapear dados da API para o formato da aplicação
    produtos = dados.map(item => ({
      id: item.Código || item.codigo || item.id,
      santo: item.Santo || item.santo,
      material: item.Material || item.material,
      tamanho: item.Tamanho || item.tamanho,
      preco: parseFloat((item.Preço || item.preco || '0').replace('R$ ', '').replace(',', '.')),
      imagem: (item.Imagem || item.imagem || '').trim() ? (item.Imagem || item.imagem) : 'imagens/produto_placeholder.png',
      disponibilidade: (item.Status || item.status || '').toLowerCase().includes('disponível'),
      descricao: item.Descrição || item.descricao || '',
      cor: item.Cor || item.cor || 'Diversos',
      quantidade: parseInt(item.Quantidade || item.quantidade || 0)
    }));
    
    produtosFiltrados = [...produtos];
    inicializarFiltros();
    renderizarCards();
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    alert('Erro ao carregar produtos. Por favor, recarregue a página.');
  }
}

// ========== FUNÇÕES DE FILTROS ==========
function inicializarFiltros() {
  // Extrair santos únicos
  const santos = [...new Set(produtos.map(p => p.santo))].sort();
  const containerSanto = document.getElementById('filtro-santo-botoes');
  
  santos.forEach(santo => {
    const botao = document.createElement('button');
    botao.className = 'filtro-botao';
    botao.textContent = santo;
    botao.onclick = () => {
      filtroSanto = filtroSanto === santo ? '' : santo;
      atualizarBotoesFiltro();
      aplicarFiltros();
    };
    botao.dataset.filtro = santo;
    containerSanto.appendChild(botao);
  });
  ativarDragParaCarrossel(containerSanto);

  // Extrair materiais únicos
  const materiais = [...new Set(produtos.map(p => p.material))].sort();
  const containerMaterial = document.getElementById('filtro-material-botoes');
  
  materiais.forEach(material => {
    const botao = document.createElement('button');
    botao.className = 'filtro-botao';
    botao.textContent = material;
    botao.onclick = () => {
      filtroMaterial = filtroMaterial === material ? '' : material;
      atualizarBotoesFiltro();
      aplicarFiltros();
    };
    botao.dataset.filtro = material;
    containerMaterial.appendChild(botao);
  });
  ativarDragParaCarrossel(containerMaterial);

  // Extrair cores únicas
  const cores = [...new Set(produtos.map(p => p.cor))].sort();
  const containerCor = document.getElementById('filtro-cor-botoes');
  
  cores.forEach(cor => {
    const botao = document.createElement('button');
    botao.className = 'filtro-botao';
    botao.textContent = cor;
    botao.onclick = () => {
      filtroCor = filtroCor === cor ? '' : cor;
      atualizarBotoesFiltro();
      aplicarFiltros();
    };
    botao.dataset.filtro = cor;
    containerCor.appendChild(botao);
  });
  ativarDragParaCarrossel(containerCor);

  atualizarBotoesFiltro();
}

function atualizarBotoesFiltro() {
  // Atualizar botões de santo
  document.querySelectorAll('#filtro-santo-botoes .filtro-botao').forEach(botao => {
    if (botao.dataset.filtro === filtroSanto) {
      botao.classList.add('ativo');
    } else {
      botao.classList.remove('ativo');
    }
  });

  // Atualizar botões de material
  document.querySelectorAll('#filtro-material-botoes .filtro-botao').forEach(botao => {
    if (botao.dataset.filtro === filtroMaterial) {
      botao.classList.add('ativo');
    } else {
      botao.classList.remove('ativo');
    }
  });

  // Atualizar botões de cor
  document.querySelectorAll('#filtro-cor-botoes .filtro-botao').forEach(botao => {
    if (botao.dataset.filtro === filtroCor) {
      botao.classList.add('ativo');
    } else {
      botao.classList.remove('ativo');
    }
  });
}

function aplicarFiltros() {
  produtosFiltrados = produtos.filter(produto => {
    const passaSanto = !filtroSanto || produto.santo === filtroSanto;
    const passaMaterial = !filtroMaterial || produto.material === filtroMaterial;
    const passaCor = !filtroCor || produto.cor === filtroCor;
    return passaSanto && passaMaterial && passaCor;
  });
  renderizarCards();
}

function limparFiltros() {
  filtroSanto = '';
  filtroMaterial = '';
  filtroCor = '';
  produtosFiltrados = [...produtos];
  atualizarBotoesFiltro();
  renderizarCards();
}

// ========== RENDERIZAÇÃO DE CARDS ==========
function renderizarCards() {
  const grid = document.getElementById('produtos-grid');
  grid.innerHTML = '';

  if (produtosFiltrados.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #888; font-size: 1.2rem;">Nenhum produto encontrado com estes filtros.</div>';
    return;
  }

  produtosFiltrados.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const statusClass = produto.disponibilidade ? 'disponivel' : 'indisponivel';
    const statusTexto = produto.disponibilidade ? 'Disponível' : 'Sob Encomenda';
    
    const precoFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(produto.preco);

    card.innerHTML = `
      <div class="card-imagem">
        <img src="${produto.imagem}" alt="${produto.santo}" onerror="this.src='imagens/021.png'">
      </div>
      <div class="card-corpo">
        <h3 class="card-santo">${produto.santo}</h3>
        <div class="card-rodape">
          <span class="card-preco">${precoFormatado}</span>
          <button class="btn-detalhes" onclick="abrirModal('${produto.id}')">Ver Detalhes</button>
        </div>
      </div>
    `;
    
    grid.appendChild(card);
  });
}

// ========== MODAL ==========
function abrirModal(produtoId) {
  produtoEmFoco = produtos.find(p => p.id === produtoId);
  
  if (!produtoEmFoco) return;

  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(produtoEmFoco.preco);

  const statusClass = produtoEmFoco.disponibilidade ? 'disponivel' : 'indisponivel';
  const statusTexto = produtoEmFoco.disponibilidade ? 'Disponível' : 'Sob Encomenda';

  document.getElementById('modal-img').src = produtoEmFoco.imagem;
  document.getElementById('modal-img').onerror = function() {
    this.src = 'imagens/021.png';
  };
  document.getElementById('modal-titulo').textContent = produtoEmFoco.santo;
  document.getElementById('modal-santo').textContent = produtoEmFoco.santo;
  document.getElementById('modal-material').textContent = produtoEmFoco.material;
  document.getElementById('modal-tamanho').textContent = produtoEmFoco.tamanho;
  document.getElementById('modal-descricao').textContent = produtoEmFoco.descricao;
  document.getElementById('modal-preco').textContent = precoFormatado;
  
  const statusElement = document.getElementById('modal-status');
  statusElement.textContent = statusTexto;
  statusElement.className = `modal-status ${statusClass}`;

  const btnEscolher = document.getElementById('btn-escolher');
  btnEscolher.disabled = !produtoEmFoco.disponibilidade;
  
  const modal = document.getElementById('modal-detalhes');
  modal.classList.add('ativa');
}

function fecharModal() {
  const modal = document.getElementById('modal-detalhes');
  modal.classList.remove('ativa');
  produtoEmFoco = null;
}

// Fechar modal ao clicar fora do conteúdo
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal-detalhes');
  if (event.target === modal) {
    fecharModal();
  }
});

// ========== INTEGRAÇÃO WHATSAPP ==========
function escolherProduto() {
  if (!produtoEmFoco) return;

  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(produtoEmFoco.preco);

  const mensagem = `Olá! Gostaria de encomendar:

📿 *${produtoEmFoco.santo}*
Material: ${produtoEmFoco.material}
Tamanho das contas: ${produtoEmFoco.tamanho}
Preço: ${precoFormatado}

Por favor, me envie mais informações sobre como proceder com a encomenda.`;

  const urlWhatsApp = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  
  window.open(urlWhatsApp, '_blank');
}

// ========== DRAG PARA CARROSSEL ==========
function ativarDragParaCarrossel(container) {
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1;
    container.scrollLeft = scrollLeft - walk;
  });

  // Touch support
  container.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('touchend', () => {
    isDown = false;
  });

  container.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 1;
    container.scrollLeft = scrollLeft - walk;
  });
}

// ========== PESQUISA COM SUGESTÕES ==========
function atualizarSugestoes(termo) {
  const containerSugestoes = document.getElementById('pesquisa-sugestoes');
  const input = document.getElementById('pesquisa-input');
  
  if (!termo.trim()) {
    containerSugestoes.innerHTML = '';
    containerSugestoes.classList.remove('ativa');
    return;
  }

  const termoLower = termo.toLowerCase();
  
  // Filtrar produtos por santo, material ou cor
  const sugestoesEncontradas = produtos.filter(produto => 
    produto.santo.toLowerCase().includes(termoLower) ||
    produto.material.toLowerCase().includes(termoLower) ||
    produto.cor.toLowerCase().includes(termoLower) ||
    produto.descricao.toLowerCase().includes(termoLower)
  ).slice(0, 8); // Limitar a 8 sugestões

  if (sugestoesEncontradas.length === 0) {
    containerSugestoes.innerHTML = '<div style="padding: 1rem; text-align: center; color: #888;">Nenhum produto encontrado</div>';
    containerSugestoes.classList.add('ativa');
    return;
  }

  containerSugestoes.innerHTML = sugestoesEncontradas.map(produto => `
    <div class="sugestao-item" onclick="selecionarSugestao('${produto.id}', '${produto.santo.replace(/'/g, "\\'")}')">
      <span class="sugestao-label">${produto.santo}</span>
      <span class="sugestao-texto">${produto.material} - ${produto.cor}</span>
    </div>
  `).join('');

  containerSugestoes.classList.add('ativa');
}

function selecionarSugestao(produtoId, santoNome) {
  // Limpar input
  document.getElementById('pesquisa-input').value = '';
  document.getElementById('pesquisa-sugestoes').classList.remove('ativa');
  document.getElementById('pesquisa-sugestoes').innerHTML = '';

  // Limpar filtros e aplicar filtro de santo
  filtroSanto = santoNome;
  filtroMaterial = '';
  filtroCor = '';
  
  atualizarBotoesFiltro();
  aplicarFiltros();
  
  // Scroll para produtos
  document.getElementById('produtos-grid').scrollIntoView({ behavior: 'smooth' });
  
  // Abrir modal se encontrar o produto
  setTimeout(() => {
    abrirModal(produtoId);
  }, 500);
}

// Fechar sugestões ao clicar fora
document.addEventListener('click', (e) => {
  const pesquisa = document.querySelector('.pesquisa-container');
  if (pesquisa && !pesquisa.contains(e.target)) {
    document.getElementById('pesquisa-sugestoes').classList.remove('ativa');
  }
});

// ========== CONTATO ==========
function abrirContato() {
  const mensagem = 'Olá! Gostaria de conhecer mais sobre os produtos do Ateliê Santo Rosário.';
  const urlWhatsApp = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  window.open(urlWhatsApp, '_blank');
}