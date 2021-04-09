using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{


	public string URL = "https://albali.eic.cefet-rj.br/micelio/api";
	public string port = "80";
	public string token = "toki";
	public string rota = "/user";
	public string method = "POST";
	public string payload = "{\"username\": \"Lucas\",\"password\":\"minha-senha\"}";

    void Start()
    {
     
        Micelio micelio = new Micelio(URL,port,token);
        micelio.SendAPIRequest(rota,method,payload);

    }

    void Update()
    {
        
    }
}
