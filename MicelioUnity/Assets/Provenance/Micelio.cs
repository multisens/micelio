using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System;
using System.Net;
using System.IO;
using System.Text;


public class Micelio
{

	private string defaultURL;
	private string port;
	private string token;
	private string device_id;
	
    // + ":" + this.port 

	//construtor classe Micelio
	public Micelio(string defaultURL,string port,string token)
	{
		this.token = token;
		this.defaultURL = defaultURL;
		this.port = port;
		this.device_id = getDeviceInformation();
	}

    private string getDeviceInformation()
    {
        return "8C:45:00:84:BC:A1";
    }

	//função para envio de dados a API
	public void SendAPIRequest(string endPoint,string method,string payload)
	{

		//criação da requisição e configuração dos parametros
        var requisicaoWeb = (HttpWebRequest) WebRequest.CreateHttp( this.defaultURL + endPoint);
        requisicaoWeb.ContentType = "application/json";
        requisicaoWeb.UserAgent = "MicelioUnityAgent";
        requisicaoWeb.Headers.Add("token", this.token);
        requisicaoWeb.Headers.Add("device_id", this.device_id);
        requisicaoWeb.ContentLength = payload.Length;
        requisicaoWeb.Method = method;

        //envio do payload para a API
        using (var stream = new StreamWriter(requisicaoWeb.GetRequestStream()))
        {
            stream.Write(payload);
            stream.Close();
        }

        //recebimento da resposta da API
    	using (var resposta = requisicaoWeb.GetResponse())
    	{
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
