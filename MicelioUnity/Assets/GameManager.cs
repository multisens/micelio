using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;


public class GameManager : MonoBehaviour
{

	private string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTcxNDQ5OTcsInN1YiI6IjJmNTZkY2Q2LWM4ODMtNGZlMC1hOWE1LWMxNGI1ZDE5ZmYyNiJ9.OaPPQEP5yJbHMauOTz0drKYPczTV479Ajc-gs1zNvEc";

    void Start()
    {
     
        //Debug.Log(Application.persistentDataPath);
        Micelio micelio = new Micelio(token);
        
        Session session = new Session("pt-BR","1");
        session.setName("começar jogo");
        //micelio.SendSession(session);

        AgentTest jogador = new AgentTest();
        Agent jog = jogador.CreateAgent();
        //Debug.Log(JsonUtility.ToJson(jog));
        
    }

    void Update()
    {

    }
}
