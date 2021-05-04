using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class AgentTest : MonoBehaviour,AgentObject
{
    private string id = Agent.GenerateAgentID();
    public string nome = "jilbert";
    public string type = "player";
    public float posx = 25;
    public float posy = 15;
    public int municao;
    public int hp;

    public AgentTest(int municao, int hp){
        
        this.municao = municao;
        this.hp = hp;
    }

    // Start is called before the first frame update
    void Start()
    {    

    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public Agent GetAgent()
    {   
        Agent temp = new Agent(id,nome,type);
        temp.SetPosition(posx,posy);
        temp.AddAttributes("municao",municao);
        temp.AddAttributes("hp",hp);
        return temp;

    }
}
