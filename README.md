# Ateliê Santo Rosário - E-commerce

Um e-commerce elegante de terços artesanais com design renascentista, integração com Google Sheets via API OpenSheet e WhatsApp.

## 🎯 Funcionalidades

✅ **Produtos dinâmicos** - Carregados automaticamente do Google Sheets  
✅ **Filtros em tempo real** - Por Santo e Material  
✅ **Design responsivo** - Funciona em todos os dispositivos  
✅ **Integração WhatsApp** - Envie pedidos direto pelo WhatsApp  
✅ **Modal elegante** - Detalhes completos do produto  
✅ **Imagens do Cloudinary** - Armazenamento otimizado de imagens

## 📋 Configuração

### 1. Número WhatsApp
Abra `produtos.js` e procure por `const numeroWhatsApp = '5511999999999'` nas funções:
- `escolherProduto()` (linha ~190)
- `abrirContato()` (linha ~210)

**Substitua `5511999999999` pelo seu número WhatsApp** (com código do país, sem espaços ou caracteres especiais).

Exemplo: `const numeroWhatsApp = '558733333333'` (para número brasileiro)

### 2. Fonte Google Sheets
O site carrega produtos automaticamente da URL:
```
https://opensheet.elk.sh/1rn0VFaxpFQX7gaUQnKnXdFC_rm0hGDE9hdPnRDfAX1Q/1
```

Para usar sua própria planilha:
1. Crie uma planilha Google com as colunas: `codigo`, `santo`, `material`, `tamanho`, `descricao`, `preco`, `imagem`
2. Compartilhe como "Qualquer pessoa com o link pode visualizar"
3. Abra `produtos.js` e atualize a URL na função `carregarProdutosDoSheet()`

## 🏗️ Estrutura

```
├── index.html          # Página principal
├── style.css           # Estilos renascentistas
├── produtos.js         # Lógica e integração dados
├── produtos.json       # Backup local de produtos
├── imagens/
│   ├── logo_santorosariooatelie.png
│   ├── 021.png        # Placeholder para cards
│   ├── fra-angelico-the-annunciation-wga00555.jpg.jpg
│   └── ...
└── fontes/
    └── Aurora.otf
```

## 🎨 Paleta de Cores

- **Azul Marinho**: #1e3a8a
- **Azul Royal**: #2563eb
- **Azul Claro**: #60a5fa
- **Ouro**: #d4af37
- **Fundo**: #f5f2ed

## 📱 Responsivo

- Desktop: Grid de 4 colunas
- Tablet: Grid de 2-3 colunas
- Mobile: 1 coluna

## 🚀 Deploy no GitHub Pages

1. Crie um repositório `seu-usuario.github.io`
2. Copie todos os arquivos para o repositório
3. Faça commit e push
4. Seu site estará online em `https://seu-usuario.github.io`

## 🔌 API de Dados

A aplicação usa a API OpenSheet que converte Google Sheets em JSON:
- **Formato**: REST API
- **Sem autenticação**: Funciona automaticamente
- **Cache**: ~1 minuto

### Campos esperados na planilha:
```
| codigo | santo | material | tamanho | descricao | preco | imagem |
```

## 🛠️ Desenvolvimento Local

```bash
# Com Python 3
python -m http.server 8000

# Ou com Node.js
npx http-server

# Abra http://localhost:8000
```

## 📞 Suporte

Para dúvidas sobre configuração do WhatsApp ou Google Sheets, verifique:
- `escolherProduto()` - Formato da mensagem
- `carregarProdutosDoSheet()` - URL da API
- `aplicarFiltros()` - Lógica de filtros

---

**Desenvolvido com ❤️ para Ateliê Santo Rosário**
