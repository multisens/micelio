using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class AgentTest : MonoBehaviour,AgentObject
{

    public string nome = "jilbert";
    public string type = "player";
    public float posx = 25;
    public float posy = 15;
    public int municao = 50;
    public int hp = 10;

    // Start is called before the first frame update
    void Start()
    {    

    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public Agent CreateAgent()
    {

        Agent temp = new Agent(nome,type);
        temp.SetPosition(posx,posy);
        temp.AddAttributes("municao",municao);
        temp.AddAttributes("hp",hp);
        return temp;

    }
}
