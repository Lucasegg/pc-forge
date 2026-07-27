# Monitor de atividades do PCForge

Coletor anônimo e agregado para uma planilha privada do Google Sheets. O relatório
é enviado a cada hora para `lucas.gomes.rosendo@gmail.com`.

## Dados permitidos

- tipo de evento;
- página;
- modo guiado, avançado ou notebook;
- categoria de dispositivo;
- detalhe técnico restrito a uma lista segura.

O monitor não deve coletar IP, nome, e-mail, conteúdo do formulário, identificador
persistente, configuração completa ou qualquer outro dado pessoal.

## Ativação

1. Abra a planilha **PCForge — Monitor de Atividades**.
2. Acesse **Extensões > Apps Script**.
3. Substitua o conteúdo pelo arquivo `Code.gs`.
4. Execute `setupMonitor` uma vez e autorize o acesso solicitado pelo Google.
5. Em **Implantar > Nova implantação**, selecione **App da Web**.
6. Execute como **você** e permita acesso a **qualquer pessoa**.
7. Copie a URL terminada em `/exec`.

A URL do Web App deve ser adicionada ao controlador de métricas do site antes da
publicação. O endpoint valida todos os valores e limita o volume por minuto, mas,
como todo endpoint público usado por um site estático, não pode ser tratado como
um segredo.
