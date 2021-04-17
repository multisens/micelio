# UnityAPI

O módulo de UnityAPI é um conjunto de scripts C# que podem ser importados no seu jogo e te auxiliam a enviar as informações à WebAPI tornando alguns passos transparentes ao desenvolvedor.



## Modelo De Classes

O MicelioUnity é um módulo que pode ser utilizado para facilitar a integração de um jogo construido pelo Unity com a API do Micelio. Esse módulo possui todas classes necessárias para cadastro das informações, além disso ele torna alguns processos muito mais simples para o desenvolvedor, como por exemplo, gerar os identificadores únicos para certas instâncias e realizar as requisições para a API.

Embora torne o processo muito mais simples, a utilização do módulo não é obrigatória. Caso o jogo seja criado em uma outra plataforma de construção de jogos, por exemplo, torna-se necessário criar toda a lógica por trás do módulo. A **Imagem 1** mostra o modelo de classe utilizado para construir o módulo. 

![Imagem 1](../Documentation/Diagramas/modelo-de-dados-unity.png)

<center><b>Imagem 1</b> - Diagrama de Classes utilizado no MicelioUnity</center>



## Utilização

Para utilizar o módulo precisamos baixar a pasta [Provenance]() e copiar ela para a pasta `Assets`, dentro do projeto Unity. Uma vez que a pasta está no projeto você começar a guardar os dados do seu jogo para analisar sua proveniência.



Toda lógia do módulo está centralizada na classe `Micelio` O primeiro passo para utilizar é garantir que sempre que o jogo for iniciado uma instância do Micelio será criada com a chave de acesso do jogo no construtor. Dentro da classe responsável por gerir o seu jogo crie esse objeto:

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
	public string token = "token-user62636264";
    
    void Start()
    {
     
        Micelio micelio = new Micelio(token);

    }

    void Update()
    {

    }
}

```



## Scripts



## Erros

