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
    public string patente;
    public int municao;
    public double hp;
    public string [] armas = { "pistola","shotgun","m4","bazuca"};

    public AgentTest(int municao, double hp, string patente){
        
        this.municao = municao;
        this.hp = hp;
        this.patente = patente;
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
        temp.AddAttributes("patente",patente);
        temp.AddAttributes("armas",armas);
        return temp;

    }
}
