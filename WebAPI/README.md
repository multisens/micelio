# WebAPI

O módulo WebAPI do Micélio é responsável por filtrar os dados enviados, relacionado ao jogos, e armazená-los no banco de dados. Para persistir os dados foi utilizado o modelo de dados criado para o projeto, a documentação do modelo pode ser encontrada clicando [aqui](https://github.com/GPMM/micelio).



## Rotas

O Micélio foi dividido em 5 rotas principais, considerando o modelo de dados criado para API. Cada uma das rotas é acessada em uma determinada fase do jogo, desde seu cadastro até a inserção de informações geradas nas sessões. Cada fase de acesso da API pode ser definida pelos nomes abaixo:

- Cadastro do Jogo;
- Cadastro do Dispositivos;
- Inicio da Sessão;
- Inserção de Atividades;
- Término da Sessão.



### Cadastro do Jogo

Essa rota é acessada apenas uma vez para cada jogo criado. Ela serve para cadastrar um jogo no banco e gerar a chave de acesso do jogo para API.

**Rota:** `/game`

**Método:** POST

**Corpo:**

```json
{
	"name": "nome_do_jogo",
	"version": "versao_do_jogo"
}
```

Descrição:

- `name` : nome do jogo;

- `version` : versão do jogo.

  

**Objeto gerado para banco:**

```json
{
	"game_id": "id0019293",
    "token": "HVJHVADVSJA15D4S5DF1S5DF4S5AFDSD",
    "name": "nome_do_jogo",
	"version": "versao_do_jogo"
}
```

> Obs.: O `game_id` servirá para refenciar o jogo no banco de dados, enquanto o `token` servirá como chave para API, permitindo a mesma, identificar para qual jogo o log está sendo enviado.



------

### Cadastro do Dispositivos

Essa rota é acessada toda vez que um novo dispositivo quer enviar informações para API. Ela serve para identificar informações sobre o dispositivo que está utilizando o jogo.

**Rota:** `/device`

**Método:** POST

**Cabeçalho:**

```json
{
    "token":"HVJHVADVSJA15D4S5DF1S5DF4S5AFDSD",
}
```

**Corpo:**

```json
{
    	"device_id": "D-456",
    	"system_name": "android",
    	"model": "SG-90110",
    	"screen_width": "1080",
	    "screen_height": "720",
}
```

Descrição:

- `device_id` : identificação unica do dispositivo (MAC);

- `system` :  sistema operacional do dispositivo;

- `model` :  modelo do dispositivo;

- `screen_width` : tamanho da tela na horizontal;

- `screen_heigth` : tamanho da tela na vertical.

  

**Objeto gerado para banco:**

```json
{
    "device_id": "D-456",
    "system": "android",
    "model": "SG-90110",
    "screen_width": "1080",
    "screen_height": "720",
}
```



------

### Inicio da Sessão

Essa rota é acessada toda vez que um jogador inicia um jogo em um dispoisitivo ja cadastrado. Ela serve para identificar a sessão de um jogo.

**Rota:** `/session`

**Método:** POST

**Cabeçalho:**

```json
{
    "token":"HVJHVADVSJA15D4S5DF1S5DF4S5AFDSD",
    "device_id": "D-456",
}
```

**Corpo:**

```json
{
    "name": "name",
    "language": "language",
    "date": "10-10-2020",
    "game_stage": 1,
    "start_time": "11:00"
}
```

Descrição:

- `name` : nome da sessão, identificador específico criado pelo desenvolvedor do jogo (opcional);

- `language` : idioma em que a sessão está sendo executada;

- `date` : dia em que a sessão foi iniciada;

- `game_stage` : fase do jogo em que aquela sessão está sendo jogada, se o jogo possuir apenas uma fase basta passar sempre 1 como parâmetro;

- `start_time` : horário em que a sessão foi iniciada.

  

**Objeto gerado para banco:**

```json
{
    "game_id": "id0019293",
    "device_id": "D-456",
    "session_id": "654321324",
    "name": "name",
    "language": "language",
    "date": "10-10-2020",
    "game_stage": 1,
    "start_time": "11:00",
    "end_time": null 
}
```



------

### Inserção de Atividades

Essa rota é acessada após a criação de uma sessão, após criar uma sessão o jogo começa a enviar todas as atividades que acontecem nele. 

**Rota:** `/activity`

**Método:** POST

**Cabeçalho:**

```json
{
    "token":"HVJHVADVSJA15D4S5DF1S5DF4S5AFDSD",
    "device_id": "D-456",
}
```

**Corpo:**

```json
{
    "activity_id": "AC-45186727",
    "name": "plantar",
    "position_x": 6549,
    "position_y": 7564,
    "time": "4",
    "influenced_by": "AC-45186790",
    "attributes":[
        {
            "name": "time_moment", 
            "value": "night"
        }
    ],
    "entities": [
        {
            "entity_id": "P-01",
            "name": "Plant",
            "position_x": 12354,
            "position_x": 65498,
            "attributes": [
                {
                    "name": "health", 
                    "value": "50"
                }
            ],
        }
    ],
    "agents":[
        {
            "agent_id": "A-01",
            "name": "Sargeiro",
            "type": "NPC",
            "position_x": 12354,
            "position_x": 65498,
            "attributes":[
               {
                   "name": "energia",
                   "value": "100"
               }
            ]
       }
    ]
}
```

Descrição:

- `activity_id` : identificador único daquela atividade;

- `name` : nome da atividade, utilizado para encontrar atividades iguais;

- `position_x` : posição no eixo X em que a atividade foi realizada (opcional);

- `position_y` : posição no eixo Y em que a atividade foi realizada (opcional);

- `time` : tempo em que a atividade foi realizada, o tempo não possui um unidade definida, pode ser um horário ou um número que represente a ordem em que as atividades aconteceram;

- `influenced_by` : identificador da atividade que tenha gerado essa atividade (opcional);

- `attributes` : array de atributos associados à atividade, essas informações podem ser custos relacionados aquela atividade ou até mesmo alguma informação que ela gere como quanto tempo ela durou (opcional). Cada objeto de atributo têm:

  - `name` : nome do atributo;
  - `value` : valor do atributo;

- `entities` : array de entidades associados aquela atividade (opcional). Cada objeto de entidade têm:

  - `entity_id` : identificador único da entidade;
  - `name` : nome da entidade, pode definir qual o tipo de objeto dele pertence;
  - `position_x` : posição no eixo X do objeto no momento da atividade (opcional);
  - `position_x` : posição no eixo Y do objeto no momento da atividade (opcional);
  - `attributes` : array de atributos associados à entidade, essas informações são informações relacionadas ao objeto, é mantido o histórico de mudança ocorrido em cada atividade (opcional). Cada objeto de atributo têm:
    - `name` : nome do atributo;
    - `value` : valor do atributo;

- `agents` : array de agentes associados aquela atividade (opcional). Cada objeto de agente têm:

  - `name` : nome do agente, serve como identificador único do objeto no jogo;

  - `type` : tipo de agente, pode ser player, npc, gameManager ou qualquer outro tipo específico relacionado a um jogo;

  - `position_x` : posição no eixo X do agente no momento da atividade (opicional);

  - `position_x` : posição no eixo Y do agente no momento da atividade (opicional);

  - `attributes` : array de atributos associados ao agente, essas informações são informações relacionadas ao agente, é mantido os históricos de mudança ocorridos em cada atividade (opcional). Cada objeto atributo têm:

    - `name` : nome do atributo;

    - `value` : valor do atributo;

      

**Objetos gerado para banco:**

```json
{
    "session_id": "654321324",
    "activity_id": "AC-45186727",
    "name": "plantar",
    "position_x": 6549,
    "position_y": 7564,
    "time": "4",
    "attributes":[
        {
            "name": "vida", 
            "value": "50"
        }
    ],
    "entities": [
        {
            "entity_id": "P-01",
            "position_x": 12354,
            "position_x": 65498,
            "name": "Plant",
            "belong" :"A-57865",
            "attributes": [
                {
                    "name": "health", 
                    "value": "50"
                }
            ],
        }
    ],
    "agents":[
        {
            "agent_id": "A-57865",
            "name": "Sargeiro",
            "type": "NPC",
            "position_x": 12354,
            "position_x": 65498,
            "attributes":[
                {
                    "name": "energia",
                    "value": "100"
                }
            ]
        }
    ]
}
```



------

### Término da Sessão

Essa rota é acessada no final de cada sessão. Ela serve para encerrar determinada sessão. O encerramento da sessão é importante para definirmos se o usuário terminou ou não o jogo.

**Rota:** `/session`

**Método:** PUT

**Cabeçalho:**

```json
{
    "token":"HVJHVADVSJA15D4S5DF1S5DF4S5AFDSD",
    "device_id": "D-456",
}
```

**Corpo:**

```json
{
     "end_time": "11:00"
}
```

Descrição:

- `end_time` : horário em que a sessão foi encerrada.

  

> Obs.: Ao receber essa requisição o sistema identifica qual a última sessão aberta por aquele dispositivo naquele jogo e atualiza seu horário de término.





## Códigos de Erro

Com o objetivo de facilitar o entendimento de uma requisição mal sucessida alguns códigos de erro foram criados. A descrição de cada um deles e uma breve solução podem ser encontrados abaixo:

| Código | Status Code | Descrição                                                    | Solução                                                      |
| ------ | :---------: | ------------------------------------------------------------ | ------------------------------------------------------------ |
| D-001  |     401     | The device information is missing.                           | Verifique se a informação de identificação do dispositivo `device_id` está sendo passada no cabeçalho da requisição. |
| D-002  |     404     | The device information is wrong. Make sure you have resgistered the device before send any information. | Verifique se o dispositivo foi cadastrado corretamente, pois a informação não está sendo encontrada no banco. |
| T-001  |     401     | You dont have game permissions to send a request.            | Verifique se a chave da API `token` está sendo passada no cabeçalho da requisição. |
| T-002  |     401     | You dont have a valid key to send a request.                 | Verifique se a chave passada na requisição está correta, pois a mesma não está sendo encontrada no banco. |
