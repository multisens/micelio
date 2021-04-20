using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System;
using System.Net;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;


public class Micelio
{
    private string defaultURL = "https://achernar.eic.cefet-rj.br/micelio/api";
    private string token;
    private string device_id;

    //construtor classe Micelio
    public Micelio(string token)
    {
        this.token = token;
        this.device_id = getDeviceInformation();

    }

    //retorna o device_id do aparelho utilizado
    private string getDeviceInformation()
    {
        string filePath = Application.persistentDataPath + "/micelioDeviceSettings.bin";
        Device device;

        //carrega informações do device, se existir
        if (File.Exists(filePath))
        {
            BinaryFormatter formatter = new BinaryFormatter();
            FileStream fs = new FileStream(filePath, FileMode.Open);
            device = (Device)formatter.Deserialize(fs);
            fs.Close();
            SendDevice(device);
        }
        else
        {
            device = new Device();

            //teste se todos os campos de Device estão completos
            if(device.VerifyDataIntegrity())
            {
                //salvos os dados no storageLocal e no banco
                BinaryFormatter formatter = new BinaryFormatter();
                FileStream fs = new FileStream(filePath, FileMode.Create);
                formatter.Serialize(fs, device);
                fs.Close();
                SendDevice(device);
            }

        }

        return device.device_id;
    }

    //envia as informações de device para o banco
    private void SendDevice(Device device)
    {
        string payload = device.toJSON();
        Debug.Log(payload);
        SendAPIRequest("/device", "POST", payload);
    }

    // envia as informações de seção para o banco
    public void SendSession(Session session)
    {
        string payload = session.toJSON();
        SendAPIRequest("/session", "POST", payload);
    }

    //função para envio de dados a API
    private void SendAPIRequest(string endPoint, string method, string payload)
    {

        //criação da requisição e configuração dos parametros
        var requisicaoWeb = (HttpWebRequest)WebRequest.CreateHttp(this.defaultURL + endPoint);
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
