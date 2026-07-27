# Política de segurança

## Versão suportada

Somente a versão publicada a partir da branch `main` recebe correções de segurança.

## Como relatar uma vulnerabilidade

Envie o relato de forma privada para `lucas.gomes.rosendo@gmail.com` com:

- descrição e impacto;
- endereço ou recurso afetado;
- passos mínimos para reproduzir;
- evidências sem dados pessoais de terceiros;
- sugestão de correção, se houver.

Não publique detalhes exploráveis em issues ou discussões antes da correção. A
confirmação inicial será enviada, quando possível, em até sete dias.

## Pesquisa responsável

São bem-vindos testes seguros que não prejudiquem usuários ou terceiros. Não são
autorizados:

- indisponibilidade, sobrecarga ou negação de serviço;
- spam ou abuso do formulário de contato;
- engenharia social, phishing ou tentativa de obter credenciais;
- acesso, alteração ou exclusão de dados de terceiros;
- testes contra GitHub, FormSubmit, jsDelivr ou outros fornecedores;
- automação agressiva.

Interrompa o teste ao encontrar qualquer dado não público. O projeto não mantém,
no momento, um programa remunerado de bug bounty e não promete recompensa
financeira.

## Escopo técnico

O PCForge é um site estático e não possui banco de dados, conta, login, sessão de
usuário ou API própria. Relatos de SQL Injection, quebra de autenticação e CSRF
precisam demonstrar um impacto real no código atual para serem considerados.

Os fornecedores externos estão fora do escopo. Vulnerabilidades neles devem ser
reportadas diretamente aos respectivos mantenedores.
