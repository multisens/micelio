using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;


public class GameManager : MonoBehaviour
{

	private string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjAzMDkyOTIsInN1YiI6IjFhYTdhMTZhLTBjYzYtNDUwOS05MWI2LTU1ZTdkNzhhOGE3NiJ9.tAkpFXTtXvEn8uasJl_xgBLVZuclqFR-DSRv_ZjD4Ws";

    void Start()
    {
        //Debug.Log(Application.persistentDataPath);
        Micelio micelio = new Micelio(token);
        
        Session session = new Session("pt-BR","1");
        session.setName("game start");
        micelio.StartSession(session);

        //string activityid = Activity.CreateActivity();

        //AgentTest jogador = new AgentTest(50,125,"sargento");
        //AgentTest jogador2 = new AgentTest(75,100,"coronel");

        micelio.CloseSession();        
    }

    void Update()
    {

    }
}
