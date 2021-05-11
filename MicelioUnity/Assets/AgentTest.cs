using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class AgentTest : MonoBehaviour,AgentObject
{
    private string id = Agent.GenerateAgentID();
    private string nome = "jilbert";
    private string type = "player";
    private double posx = 25;
    private double posy = 15;
    private string patente;
    private int municao;
    private double hp;
    private string [] armas = { "pistola","shotgun","m4","bazuca"};

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
        temp.AddProperty("municao",municao);
        temp.AddProperty("hp",hp);
        temp.AddProperty("patente",patente);
        temp.AddProperty("armas",armas);
        return temp;

    }
}
