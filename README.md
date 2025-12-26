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
