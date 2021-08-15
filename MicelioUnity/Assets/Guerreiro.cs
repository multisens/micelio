using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class Guerreiro : AgentFactory
{
    private string id_agent = Agent.GenerateAgentID();
    public string nome = "Guerreiro";
    public string type = "player";
    public double posx;
    public double posy;
    public string grupo;
    public int forca;
    public double vida;

    public Guerreiro(int forca, double vida, string grupo, double x, double y)
    {
        this.forca = forca;
        this.vida = vida;
        this.grupo = grupo;
        this.posx = x;
        this.posy = y;
    }

    public void Atacar(Espada espada, string time)
    {  
        Debug.Log("atacando com forca " + this.forca);

        Activity ataque = new Activity("ataque", time);
        
        ataque.SetPosition(this.posx,this.posy);
        ataque.AddAgent(this, "atacante");
        ataque.AddEntity(espada, "objeto utilizado");

        GameManager.micelio.SendActivity(ataque);
    }

    public Agent GetAgent()
    {   
        Agent a = new Agent(id_agent, nome, type);
       
        a.SetPosition(posx,posy);
        a.AddProperty("munição", forca);
        a.AddProperty("pontos de vida", vida);
        a.AddProperty("grupo", grupo);
       
        return a;
    }
}