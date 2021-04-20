using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class GameManager : MonoBehaviour
{

	public string token = "token-user62636264";

    void Start()
    {
     
        Micelio micelio = new Micelio(token);
        Session session = new Session("pt-BR","1");
        session.setName("começar jogo");
        //micelio.SendSession(session);
        Debug.Log(Application.persistentDataPath);

    }

    void Update()
    {

    }
}
