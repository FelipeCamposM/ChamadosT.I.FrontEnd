📝 Visualizador de Chamados
Bem-vindo ao Visualizador de Chamados! Este projeto foi desenvolvido para facilitar o gerenciamento e controle de chamados, permitindo uma visualização organizada e filtrável das solicitações finalizadas. Com ele, é possível buscar, filtrar e acompanhar facilmente as informações de cada chamado.

🌟 Funcionalidades
Visualização de Chamados Finalizados: Exibe uma lista de chamados finalizados com informações detalhadas de cada um.
Busca e Filtragem 🔍: Utilize o campo de busca para encontrar chamados específicos. Filtre por tipo de problema e responsável para otimizar a visualização.
Ordenação 📊: Chamados são organizados do mais recente ao mais antigo, facilitando o acompanhamento.
Paginação 📄: Navegue por várias páginas de chamados, ideal para visualizar grandes quantidades de dados.
🚀 Tecnologias Utilizadas
Next.js - Framework de React para criação de interfaces dinâmicas.
TypeScript - Garantindo tipagem segura durante o desenvolvimento.
Tailwind CSS - Estilização rápida e responsiva.
Prisma - ORM para gerenciamento de dados no banco de dados.
React Hooks - Controle de estado e efeitos no frontend.
📦 Estrutura do Projeto
components: Componentes UI reutilizáveis, como botões, tabelas e diálogos.
utils: Funções utilitárias para formatação de dados e outras operações.
pages: Estrutura de rotas do projeto, com a página principal dos chamados.
📸 Demonstração
Em breve!

⚙️ Como Rodar o Projeto
Clone o repositório:

bash
Copiar código
git clone https://github.com/chzin777/visualizador-chamados.git
cd visualizador-chamados
Instale as dependências:

bash
Copiar código
npm install
Configure as variáveis de ambiente no arquivo .env:

makefile
Copiar código
DATABASE_URL="sua_string_de_conexão"
Rode o servidor de desenvolvimento:

bash
Copiar código
npm run dev
Acesse o projeto em http://localhost:3000.

🛠️ Configuração do Banco de Dados
O projeto utiliza Prisma para manipular o banco de dados. Certifique-se de que seu banco de dados esteja configurado e rode a migração:

bash
Copiar código
npx prisma migrate dev
📝 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir uma Issue ou enviar um Pull Request.

🧑‍💻 Desenvolvido por Felipe Campos Macedo

Se gostou, deixe uma ⭐!