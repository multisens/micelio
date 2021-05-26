# MicelioUnity

O MicelioUnity é um módulo  construido em C# que pode ser utilizado para facilitar a integração de um jogo criado no Unity com a API do Micelio. Esse módulo possui todas classes necessárias para cadastro das informações, além disso ele torna alguns processos muito mais simples para o desenvolvedor, como por exemplo, gerar os identificadores únicos para certas instâncias e realizar as requisições para a API.



## Modelo De Classes

Embora torne o processo muito mais simples, a utilização do módulo não é obrigatória. Caso o jogo seja criado em uma outra plataforma de construção de jogos, por exemplo, torna-se necessário criar toda a lógica por trás do módulo. A **Imagem 1** mostra o modelo de classe utilizado para construir o módulo. 

![Imagem 1](../Documentation/Diagramas/modelo-de-dados-unity.png)

<center><b>Imagem 1</b> - Diagrama de Classes utilizado no MicelioUnity</center>



## Utilização

Para utilizar o módulo precisamos baixar a pasta [Provenance]() e copiar ela para a pasta `Assets`, dentro do projeto Unity. Uma vez que a pasta está no projeto você começar a utilizar o módulo para envio das informações.

A utilização do módulo se dá em duas etapas:

- Preparação das Classes;
- Envio dos Dados;



### Preparação das Classes

-------

O sistema do Micélio foi projetado para recolher dados de qualquer jogo. De forma geral os componentes do jogo são divididos em 3 classes, entidades, agentes e atividades. A definição para cada um deles é explicada na [documentação](https://github.com/GPMM/micelio) geral da plataforma.

Para que o módulo possa classificar as classes do seu jogo como Agentes e Entidades é necessária uma preparação prévia das classes.



#### Definindo Entidades e Agentes

Para definir as suas classes como Agentes e Entidades, o módulo MicelioUnity conta com duas interfaces que podem ser implementadas, são elas:

- <u>EntityObject:</u> Define uma classe como uma entidade no Micélio;
- <u>AgentObject:</u> Define uma classe como um agente no Micélio.



Cada uma dessas interfaces possuem, respectivamente, os métodos `GetEntity` e `GetAgent`. Esses métodos servem para definir como uma classe pode se tornar uma entidade ou um agente, eles serão utilizados para inserir os objetos nas atividades que serão enviadas.

Além da implementação das funções, é muito importante definir o identificador único da entidade ou agente. Esse identificador servirá para reconhecer aquela instância, dessa forma é possível identificar se aquela instância é nova ou está apenas sendo atualizada. Para criação desses identificadores as classes `Entity` e `Agent` oferecem os métodos staticos `GenerateEntityID()` e `GenerateAgentID()` que solucionam esse problema.



##### EntityObject

Ao implementar a interface `EntityObject` é necessário criar o método `GetEntity()`, esse método deve retornar um objeto da classe `Entity`.

Para instanciar um `Entity` precisamos de apenas dois parâmetros, são eles:

- `id_entity` : Identificador único da entidade naquela sessão. Esse identificador deve ser atribuido por instância e não deve ser alterado durante a execução do jogo. Para geração dos IDs é recomendado que se crie um atributo na classe, que irá representar esse ID, e para gerá-lo, utilize a função estática disponível na classe `Entity` `GenerateEntityID()`, essa função irá retornar um ID baseado no momento de criação da instância.

- `name` : Nome da entidade. Representa o significado daquela entidade, pode ser fixo, ou variar dependendo da instância.

  

  ##### Parâmetros Opcionais

- `role` : Papel da entidade atualmente. É utilizado quando uma atividade é enviada para saber qual a participação da entidade no evento. Para definir o papel de uma entidade utilize o método `SetRole(string role)`.

- `position_x` e `position_y` : Posição atual da entidade. Define onde o objeto está apresentado na tela. Para definir a posição de uma entidade utilize o método `SetPosition(double x, double y)`.

- `properties` : Propriedades gerais da entidade. Valores específicos de cada jogo. Para adicionar propriedades à entidade utilize o método `AddProperty(string name, object value)`.

  

O exemplo abaixo mostra como criar uma entidade `Arma` no Unity.

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class Arma : MonoBehaviour, EntityObject
{
    private string id_entity = Entity.GenerateEntityID();
    public string nome = "Arma";
    public double peso;
    public int poder ;

    public Soldado(int poder, double peso)
    {
        this.poder = poder;
        this.peso = peso;
    }

    void Start()
    {    

    }

    void Update()
    {
        
    }

    public Entity GetEntity()
    {   
        Entity e = new Entity(id_entity, nome);
		e.AddProperty("poder", poder);
        e.AddProperty("peso", peso);
        return e;

    }
}
```



##### AgentObject

Ao implementar a interface `AgentObject` é necessário criar o método `GetAgent()`, esse método deve retornar um objeto da classe `Agent`.

Para instanciar um `Agent` precisamos de apenas três parâmetros, são eles:

- `id_agent` : Identificador único do agente naquela sessão. Esse identificador deve ser atribuido por instância e não deve ser alterado durante a execução do jogo. Para geração dos IDs é recomendado que se crie um atributo na classe, que irá representar esse ID, e para gerá-lo, utilize a função estática disponível na classe `Agent` `GenerateEntityID()`, essa função irá retornar um ID baseado no momento de criação da instância.

- `name` : Nome do agente. Representa o significado daquele agente, pode ser fixo, ou variar dependendo da instância.

- `type` : Define o tipo de agente. Classifica os agentes identificando de que tipo eles são, não existe uma regra pra definir os tipos de agentes, mas opções que podem ser utilizadas são NPC, Player, GameManager, etc.

  

  ##### Parâmetros Opcionais

- `role` : Papel do agente atualmente. É utilizado quando uma atividade é enviada para saber qual a participação do agente no evento. Para definir o papel de um agente utilize o método `SetRole(string role)`.

- `position_x` e `position_y` : Posição atual do agente. Define onde o objeto está apresentado na tela. Para definir a posição de um agente utilize o método `SetPosition(double x, double y)`.

- `properties` : Propriedades gerais do agente. Valores específicos de cada jogo. Para adicionar propriedades ao agente utilize o método `AddProperty(string name, object value)`.



O exemplo abaixo mostra como criar um agente `Soldado`no Unity.

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class Soldado : MonoBehaviour, AgentObject
{
    private string id_agent = Agent.GenerateAgentID();
    public string nome = "Soldado";
    public string type = "player";
    public double posx;
    public double posy;
    public string patente;
    public int municao;
    public double hp;

    public Soldado(int municao, double hp, string patente, double x, double y)
    {
        this.municao = municao;
        this.hp = hp;
        this.patente = patente;
        this.posx = x;
        this.posy = y;
        
    }

    void Start()
    {    

    }

    void Update()
    {
        
    }

    public Agent GetAgent()
    {   
        Agent a = new Agent(id_agent, nome, type);
        a.SetPosition(posx,posy);
        a.AddProperty("munição", municao);
        a.AddProperty("pontos de vida", hp);
        a.AddProperty("patente", patente);
        return a;
    }
}

```

> Obs.: Definir a role de um agente ou entidade dentro dos métodos `GetAgent` e `GetEntity` fará com que toda instância daquela classe tenha o mesmo papel em todas as atividades. Tenha cuidado ao fazer isso. A role também poderá ser definida ao inserir o objeto dentro da atividade.



### Envio dos Dados

------

Para enviar dados para API é necessário possuir uma chave de acesso. Além disso é necessário enviar os payloads como são definidos na documentação. Com o objetivo de facilitar isso, a classe `Micelio` foi criada para abstrair todo esse processo.



#### Micelio

Toda lógica do módulo está centralizada na classe `Micelio`. O primeiro passo para utilizar, é garantir que sempre que o jogo for iniciado, uma instância do Micelio será criada passando a chave de acesso do jogo no construtor. Dentro da classe responsável por gerir o seu jogo, crie o objeto Micelio:

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
	public string token = "token-12345678";
    public static Micelio micelio;
    
    void Start()
    {
     
        micelio = new Micelio(token);

    }

    void Update()
    {

    }
}

```

> Obs.: O atributo `micelio` foi declarado com estático para que possa ser acessado pelas outras classes, essa é uma boa prática para utilização, mas não é uma regra.



#### Envio de Sessões

Agora que temos um instância do Micelio criada, nos temos acesso a alguns métodos importantes que nos permitirão cadastrar os logs de proveniência. Dois dos principais métodos são:

- `micelio.StartSession(Session session);`

  Esse método será responsável por definir o início de uma sessão. Uma vez definida o início de uma sessão, seus dados não poderão mais ser alterados. 

  

- `micelio.CloseSession();`

  Esse método será responsável por definir o término de uma sessão. Embora não impacte na análise dos dados enviados, o término de uma sessão é muito importante. Através dele podemos saber so o jogo finalizou corretamente ou se ele foi fechado de forma inesperada, seja por um crash ou pela vontade do usuário.



Para que seja possível enviar uma sessão, precisamos criar uma instância de `Session`, que será passada como parâmetro da requisição. Embora uma sessão tenha diversos atributos, a criação de uma instância é muito simples, necessitando apenas do **idioma** e da **fase** em que o jogador se encontra. Uma vez criada a sessão, podemos chamar o método `StartSession()` e a partir dai, começar a enviar as atividades. Veja o exemplo:

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
	public string token = "token-12345678";
    public static Micelio micelio;
    
    void Start()
    {
        micelio = new Micelio(token);
        
        Session s = new Session('pt-br','1');
        micelio.StartSession(s);
    }

    void Update()
    {
	
        // comandos
        
        // final da sessão
        micelio.CloseSession();
        
    }
}

```

> Obs.:  Os parâmetros de idioma e fase, obrigatórios para a construção de uma sessão, não possuem um formato específico para se seguir, porém, seguir um padrão na sua aplicação pode ajudar muito na análise dos dados. [Exemplo de padrão para idiomas](https://support.zendesk.com/hc/pt-br/articles/203761906-Suporte-a-Idiomas-por-produto-da-Zendesk).



##### Parâmetros Opcionais

Opcionalmente, podemos definir informações como nome da sessão e grupo de sessão ao qual ela pertence, para isso, a classe `Session` disponibiliza 2 métodos, veja o exempo:

```c#
Session s = new Session('pt-br','bonus 2');
s.SetName('Holiday Event');
s.SetSessionGroup('0123-4567-8910');

micelio.StartSession(s);
```



##### 	Gerenciamento de Sessões

Uma sessão pode ser criada a cada vez que o jogador entra no jogo, mas isso não é uma regra. Se um jogo possui um menu inicial, pode ser que o 	usuário inicie várias sessões sem precisar reinicar o jogo. Neste caso a instanciação e envio das informações de sessão podem ser feitas na função `Update()` ao invés da função `Start()`.



#### Envio de Atividades

As atividades no Micelio representam eventos que aconteceram dentro do seu jogo. Esses eventos podem ser disparados por agentes, entidades ou até mesmo outros eventos. A forma como isso foi implementado no módulo é muito simples, basta que você crie uma instância de `Activity` e envie essa para a API através do método `micelio.SendActivity(Activity activity)`.

Para criar uma atividade devem ser passados os atributos:

- `name` : Representa o nome de uma atividade, pode ser usado para identificar os eventos gerados no jogo.
- `time` : Representa o tempo do jogo em que aquele evento aconteceu. Não existe uma regra para definição do tempo, ele pode ser definido de acordo com a necessidade do seu jogo, podem ser: o tempo real, o tempo de execução do jogo ou até mesmo algo mais específico do seu jogo, como uma rodada ou algo parecido.

Veja o exemplo abaixo do evento de atirar, `Fire()`, contruido dentro da classe `Soldado`, criada anteriormente:

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class Soldado : MonoBehaviour, AgentObject
{
    private string id_agent = Agent.GenerateAgentID();
    public string nome = "Soldado";
    public string type = "player";
    public double posx;
    public double posy;
    public string patente;
    public int municao;
    public double hp;

    public Soldado(int municao, double hp, string patente, double x, double y)
    {
        this.municao = municao;
        this.hp = hp;
        this.patente = patente;
        this.posx = x;
        this.posy = y;
        
    }

    void Start()
    {    

    }

    void Update()
    {
        
    }

    public void Fire(Arma gun, string time)
    {   
        Debug.Log("pow");
        this.municao--;

        Activity fire = new Activity("fire", time);
        fire.SetPosition(this.posx,this.posy);
        fire.AddAgent(this);
        fire.AddEntity(gun);
        micelio.SendActivity(fire);
    }

    public Agent GetAgent()
    {   
        Agent a = new Agent(id_agent, nome, type);
        a.SetPosition(posx,posy);
        a.AddProperty("munição", municao);
        a.AddProperty("pontos de vida", hp);
        a.AddProperty("patente", patente);
        return a;
    }
}
```

> Obs.: Os métodos `AddAgent`  e `AddEntity` possuem um segundo parâmetro, opcional, que representa o papel (role) daquele objeto naquela atividade. Por exemplo: fire.AddEntity(gun, "objeto utilizado");



##### Parâmetros Opcionais

- `influenced_by` : Define o identificador da atividade que gerou essa atividade. Esse parâmetro pode ser setado para ligar as atividades. Para definir o identificador utilize o método `SetInfluence(string activity_id)`.
- `position_x` e `position_y` : Posição atual da atividade. Define onde o evento aconteceu. Para definir a posição de uma atividade utilize o método `SetPosition(double x, double y)`.
- `properties` : Propriedades gerais do agente. Valores específicos de cada jogo. Para adicionar propriedades ao agente utilize o método `AddProperty(string name, object value)`.
- `agents` : Array que define todos os agentes que participaram daquele evento. Para adicionar agentes a um evento utilize o método `AddAgent(AgentObject agent_object)`.
- `entities` : Array que define todos entidades que participaram daquele evento. Para adicionar entidades a um evento utilize o método `AddEntity(EntintyObject entity_object)`.



> Obs.: Para pegar o identificador único de uma atividade, que deve ser passado no método `influenced_by`, após instânciar uma atividade, você pode usar `activity.activity_id`.

