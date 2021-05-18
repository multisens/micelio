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

        Soldado player = new Soldado(10,25,"soldier",150,130);
        Arma gun = new Arma(5,1.5);

        player.Fire(gun,"wave 1");

        micelio.CloseSession();        
    }

    void Update()
    {

    }
}
