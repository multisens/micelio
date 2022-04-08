# MicelioAPI

O módulo MicelioAPI do Micélio é responsável por gerenciar os dados da plataforma. Ele recebe dados relacionados a usuários, dispositivos, e jogos e armazena eles no banco de dados. No caso dos jogos, as informações das atividades são filtradas e armazenadas em suas respectivas tabelas. Para persistir os dados foi utilizado o modelo de dados criado para o projeto, a documentação do modelo pode ser encontrada clicando [aqui](https://github.com/GPMM/micelio).



## Rotas

O Micélio foi dividido em 4 rotas principais, considerando o modelo de dados criado para API. Cada uma das rotas é acessada em uma determinada fase, desde cadastro de um dispositivo, passando pelo inicio de uma sessão, a inserção de informações geradas nas sessões de um jogo e o término de uma sessão . Cada fase de acesso da API pode ser definida pelos nomes abaixo:

- Cadastro do Dispositivos;
- Inicio da Sessão;
- Inserção de Atividades;
- Término da Sessão.



As rotas disponíveis publicamente precisam de algumas chaves para validar o envio dos dados, essas chaves são representadas pelo token de um jogo e a identificação de um dispositivo. 



### Cadastro do Dispositivos

Essa rota é acessada toda vez que um novo dispositivo quer enviar informações para API. Ela serve para identificar informações sobre o dispositivo que está utilizando o jogo.

**Rota:** `/device`

**Método:** POST

**Cabeçalho (header):**

```json
{
    "token": "HVJHVADVSJA15D4S5DF1S5DF4S5AFDSD",
}
```

**Corpo (body):**

```json
{
    "device_id": "D-456",
    "system_name": "android",
    "model": "SG-90110",
    "screen_width": 1080,
    "screen_height": 720,
}
```

Descrição:

- `device_id` : identificação unica do dispositivo (ex: MAC);

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
    "screen_width": 1080,
    "screen_height": 720,
}
```

> Obs.: Embora a informação não seja utilizada no cadastro, nesta rota, o token é passado para garantir que apenas jogos cadastrados possam enviar requisições a API.



------

### Inicio da Sessão

Essa rota é acessada toda vez que um jogador inicia um jogo em um dispositivo já cadastrado. Ela serve para identificar a sessão de um jogo.

**Rota:** `/session`

**Método:** POST

**Cabeçalho (header):**

```json
{
    "token": "HVJHVADVSJA15D4S5DF1S5DF4S5AFDSD",
    "device_id": "D-456",
}
```

**Corpo  (body):**

```json
{
    "name": "name",
    "language": "language",
    "date": "2020-10-10",
    "game_stage": "1",
    "session_group": "1bskaoi23nspsd",
    "start_time": "11:00"
}
```

Descrição:

- `name` : nome da sessão, identificador específico criado pelo desenvolvedor do jogo (opcional);
- `language` : idioma em que a sessão está sendo executada;
- `date` : dia em que a sessão foi iniciada, no formato AAAA-MM-DD;
- `game_stage` : fase do jogo em que aquela sessão está sendo jogada, se o jogo possuir apenas uma fase basta passar sempre 1 como parâmetro;
- `session_group` : identificador do grupo de sessões criado para análise (opcional).
- `start_time` : horário em que a sessão foi iniciada.



**Objeto gerado para banco:**

```json
# TABELA Session --------------------------------------------------------------------------------------------------------------------
{
    "game_id": "id0019293",
    "device_id": "D-456",
    "session_id": "654321324",
    "name": "name",
    "language": "language",
    "date": "2020-10-10",
    "game_stage": "1",
    "start_time": "11:00",
    "end_time": null 
}

# TABELA SessionInGroup -------------------------------------------------------------------------------------------------------------
{
    "session_id": "654321324",
    "session_group_id": "1bskaoi23nspsd"
}
```



------

### Inserção de Atividades

Essa rota é acessada após a criação de uma sessão, após criar uma sessão o jogo começa a enviar todas as atividades que acontecem nele. 

**Rota:** `/activity`

**Método:** POST

**Cabeçalho (header):**

```json
{
    "token": "HVJHVADVSJA15D4S5DF1S5DF4S5AFDSD",
    "device_id": "D-456",
}
```

**Corpo (body):**

```json
{
    "activity_id": "AC-45186727",
    "name": "plantar",
    "position_x": 6549,
    "position_y": 7564,
    "time": "4",
    "influenced_by": "AC-45186790",
    "influenced_by_porperties": {},
    "properties": {"time_moment": "night"},
    "entities": [
        {
            "entity_id": "P-01",
            "name": "Plant",
            "position_x": 12354,
            "position_y": 65498,
            "properties": {"health": 50},
            "role": "item plantado"
        }
    ],
    "agents":[
        {
            "agent_id": "A-01",
            "name": "Sargeiro",
            "type": "NPC",
            "position_x": 12354,
            "position_y": 65498,
            "properties":{"energia": 100},
            "role": "quem plantou"
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

- `influenced_by` : identificador de outra atividade que tenha influenciado no acontecimento dessa atividade (opcional);

- `influenced_by_properties`: JSON contendo as propriedades que causaram a influencia de outra atividade.

- `properties` : JSON convertido em string de atributos associados à atividade. Essas informações podem ser custos relacionados aquela atividade ou até mesmo alguma informação que ela gere como quanto tempo ela durou (opcional).

- `entities` : array de entidades associados aquela atividade (opcional). Cada objeto de entidade têm:

  - `entity_id` : identificador único da entidade;
  - `name` : nome da entidade, pode definir qual o tipo de objeto dele pertence;
  - `position_x` : posição no eixo X do objeto no momento da atividade (opcional);
  - `position_y` : posição no eixo Y do objeto no momento da atividade (opcional);
  - `properties` : JSON convertido em string de atributos associados à entidade. Essas informações são informações relacionadas ao objeto, e é mantido o histórico de mudança ocorrido em cada atividade (opcional).
  - `role`: papel daquela entidade naquela atividade, define qual a participação do objeto naquele evento.
  
- `agents` : array de agentes associados aquela atividade (opcional). Cada objeto de agente têm:

  - `agent_id` : identificador único daquele agente;

  - `name` : nome do agente;

  - `type` : tipo de agente, pode ser player, npc, gameManager ou qualquer outro tipo específico relacionado a um jogo;

  - `position_x` : posição no eixo X do agente no momento da atividade (opicional);

  - `position_y` : posição no eixo Y do agente no momento da atividade (opicional);

  - `properties` :  JSON convertido em string de atributos associados ao agente. Essas informações são informações relacionadas ao agente, e é mantido os históricos de mudança ocorridos em cada atividade (opcional).

  - `role`: papel daquele agente naquela atividade, define qual a participação do objeto naquele evento.
  
    

**Objetos gerado para banco:**

```json
# TABELA Activity -------------------------------------------------------------------------------------------------------------------
{
    "session_id": "654321324",
    "activity_id": "AC-45186727",
    "name": "plantar",
    "time": "4",
    "properties": {"time_moment": "night"}
}

# TABELA Action ---------------------------------------------------------------------------------------------------------------------
{
    "activity_id": "AC-45186727",
    "position_x": 6549,
    "position_y": 7564
}

# TABELA InfluencedBy ---------------------------------------------------------------------------------------------------------------
{
    "influenced_by_id": "if-sdjljsld",
    "influence_id": "AC-45186790",
    "influenced_id": "AC-45186727",
    "properties": {}
}    

# TABELA Entity ---------------------------------------------------------------------------------------------------------------------
{
    "entity_id": "P-01",
    "name": "Plant",
    "properties": {"health": 50}
}

# TABELA GameObject -----------------------------------------------------------------------------------------------------------------
{
    "entity_id": "P-01",
    "position_x": 12354,
    "position_y": 65498
}        
# TABELA ActivityEntities -----------------------------------------------------------------------------------------------------------
{
    "entity_id": "P-01",
    "activity_id": "AC-45186727",
    "properties":  {"health": 50},
    "role": "item plantado"
}

# TABELA Agent ----------------------------------------------------------------------------------------------------------------------
{
    "agent_id": "A-01",
    "name": "Sargeiro",
    "type": "NPC",
    "properties": {"energia": 100}
}

# TABELA ActivityAgents -------------------------------------------------------------------------------------------------------------
{
    "agent_id": "A-01",
    "activity_id": "AC-45186727",
    "properties": {"energia": 100},
    "role": "quem plantou"
}

# TABELA GameCharacter --------------------------------------------------------------------------------------------------------------
{
    "agent_id": "A-01",
    "position_x": 12354,
    "position_y": 65498,
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
    "token": "HVJHVADVSJA15D4S5DF1S5DF4S5AFDSD",
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



#### D-001

**Status:** 401

**Descrição:** The device information is missing.

**Solução:** Verifique se a informação de identificação do dispositivo `device_id` está sendo passada no cabeçalho da requisição.



#### D-002

**Status:** 404

**Descrição: **The device information is wrong. Make sure you have resgistered the device before send any information.

**Solução:** Verifique se o dispositivo foi cadastrado corretamente, pois a informação não está sendo encontrada no banco.



#### T-001

**Status:** 401

**Descrição:** You dont have game permissions to send a request.

**Solução:** Verifique se a chave da API `token` está sendo passada no cabeçalho da requisição.



#### T-002

**Status:** 401

**Descrição: **You dont have a valid key to send a request.

**Solução:** Verifique se a chave passada na requisição está correta, pois a mesma não está sendo encontrada no banco.



#### T-003

**Status:** 400

**Descrição:**  Cannot validate your token.

**Solução:**   Verifique se o token enviado está correto.





# Subindo uma Instância do Micélio API



[WIP]