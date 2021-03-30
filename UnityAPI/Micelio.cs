using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System;
using System.Net;
using System.IO;
using System.Text;

/*
    
    Micelio micelio = new Micelio("http://127.0.0.1","7777","f213b79567e5aea2fd1df78979832e64");
    micelio.SendAPIRequest("/game","POST","{\"name\": \"Control Harvest3\",\"version\": \"1.0.1\"}");

*/


public class Micelio{

	private string defaultURL;
	private string port;
	private string token;
	
	public Micelio(string defaultURL,string port,string token){
		this.token = token;
		this.defaultURL = defaultURL;
		this.port = port;
	}

	public void SendAPIRequest(string endPoint,string method,string payload){

        var requisicaoWeb = (HttpWebRequest) WebRequest.CreateHttp( this.defaultURL + ":" + this.port + endPoint);

        requisicaoWeb.ContentType = "application/json";
        requisicaoWeb.UserAgent = "MicelioUnityAgent";
        requisicaoWeb.ContentLength = payload.Length;
        requisicaoWeb.Method = method;

        using (var stream = new StreamWriter(requisicaoWeb.GetRequestStream())){
            stream.Write(payload);
            stream.Close();
        }

    	using (var resposta = requisicaoWeb.GetResponse()){
            var streamDados = resposta.GetResponseStream();
            StreamReader reader = new StreamReader(streamDados);

            HttpStatusCode statusCode = ((HttpWebResponse)resposta).StatusCode;
            Debug.Log(statusCode);
            
            object objResponse = reader.ReadToEnd();
            Debug.Log("STATUS: " + objResponse.ToString());

            streamDados.Close();
            resposta.Close();
		}  	
	}

}
