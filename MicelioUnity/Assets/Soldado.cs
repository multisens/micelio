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
        GameManager.micelio.SendActivity(fire);
    }

    public Agent GetAgent()
    {   
        Agent a = new Agent(id_agent, nome, type);
        a.SetPosition(posx,posy);
        a.AddProperty("munição", municao);
        a.AddProperty("pontos de vida", hp);
        a.AddProperty("patente", patente);
        a.SetRole("atirador");
        return a;
    }
}