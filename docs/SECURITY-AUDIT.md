# Auditoria de segurança — 27 de julho de 2026

## Resumo

O PCForge é uma aplicação estática executada no navegador e hospedada no GitHub
Pages. Não existe servidor de aplicação, banco de dados, autenticação, upload de
arquivos ou armazenamento de builds. Por isso, SQL Injection, NoSQL Injection,
SSRF, escalada de privilégios e quebra de autenticação não possuem uma superfície
explorável no desenho atual.

Os riscos relevantes são DOM XSS, manipulação de parâmetros, abuso do formulário,
clickjacking, dependências externas, indisponibilidade no cliente, vazamento por
referer e comprometimento da cadeia de desenvolvimento.

## Controles implementados

| Risco | Controle |
|---|---|
| DOM XSS e scripts injetados | CSP sem `unsafe-inline` para scripts e controlador de navegação externo |
| Script externo comprometido | jsPDF com versão exata e Subresource Integrity (SRI) |
| Dependência desatualizada | jsPDF 4.2.1, CodeQL semanal e Dependabot para GitHub Actions |
| Parâmetro `build` malicioso | limite de 2 KB, Base64 URL-safe, validação estrutural e lista permitida |
| Prototype pollution / tipos inesperados | validação de tipo e propriedade própria antes de acessar componentes |
| Abuso acidental do formulário | CAPTCHA, honeypot, limites de tamanho, bloqueio de repetição e timeout |
| Exposição do endereço anterior | `Referrer-Policy: strict-origin-when-cross-origin` |
| Conteúdo/plugin legado | CSP com `object-src`, `frame-src`, `media-src` e `worker-src` bloqueados |
| Recursos externos desnecessários | Google Fonts removido; fonte passa a ser local ao sistema |
| Divulgação de vulnerabilidades | `SECURITY.md` e `/.well-known/security.txt` |
| Falhas futuras no JavaScript | CodeQL em pushes, pull requests e toda semana |

## CVEs revisadas

A única biblioteca executável de terceiros é o jsPDF. O site usa a versão 4.2.1:

- CVE-2025-29907 (ReDoS em versões até 3.0.0), corrigida em 3.0.1;
- CVE-2025-68428 (leitura de arquivos no build Node antes de 4.0.0);
- CVE-2026-24133 (DoS por BMP antes de 4.1.0);
- CVE-2026-24737 e CVE-2026-24040 (injeções em APIs antes de 4.1.0);
- CVE-2026-25535, CVE-2026-25755 e CVE-2026-25940 (DoS/injeções antes de 4.2.0);
- CVE-2026-31938 (XSS por opções de saída antes de 4.2.1).

A versão utilizada contém as correções publicadas para esses registros. O
PCForge também não usa `addImage`, `html`, `addJS`, AcroForm ou entrada de opções
de PDF fornecida pelo usuário, reduzindo a exposição mesmo a APIs historicamente
afetadas.

## Limitações conhecidas

GitHub Pages controla os cabeçalhos HTTP. O site recebe HTTPS e HSTS, mas não é
possível definir livremente todos os cabeçalhos, especialmente
`Content-Security-Policy: frame-ancestors` e `X-Frame-Options`. A CSP entregue
por `<meta>` protege carregamentos e scripts, mas não bloqueia enquadramento por
outro site. Proteção completa contra clickjacking exige um host ou proxy que
permita cabeçalhos customizados.

O formulário é processado pelo FormSubmit. Limites no navegador podem ser
contornados por quem enviar requisições diretamente ao fornecedor; CAPTCHA e
proteções antispam efetivas dependem do serviço externo.

## Fontes

- [OWASP Top 10:2025](https://owasp.org/Top10/)
- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [OWASP DOM XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)
- [GitHub Advisory Database](https://github.com/advisories)
- [NIST National Vulnerability Database](https://nvd.nist.gov/)
- [GitHub Pages: HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
