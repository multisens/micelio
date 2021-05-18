using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System;
using System.Reflection;
using System.Net;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;


public class Micelio
{
    //private string defaultURL = "http://127.0.0.1:7777/api";
    private string defaultURL = "https://achernar.eic.cefet-rj.br/micelio/api";
    private string token;
    private string device_id;
    private Assembly dll;

    //construtor classe Micelio
    public Micelio(string token)
    {

        this.token = token;
        this.device_id = GetDeviceInformation();
        string path = Directory.GetCurrentDirectory();
        this.dll = Assembly.LoadFrom(path+"/Assets/Provenance/LitJson.dll");

    }

    public static string ToJSON(object o)
    {
        string json = LitJson.JsonMapper.ToJson(o);
        Debug.Log(json);
        return json;
    }

    //retorna o device_id do aparelho utilizado
    private string GetDeviceInformation()
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
            Debug.Log("device information successfully found");
        }
        else
        {
            Debug.Log("device information not found");
            Debug.Log("loading device information ...");
            device = new Device();

            //teste se todos os campos de Device estão completos
            if(device.VerifyDataIntegrity())
            {
                //salvos os dados no storageLocal e no banco
                try
                {
                    BinaryFormatter formatter = new BinaryFormatter();
                    FileStream fs = new FileStream(filePath, FileMode.Create);
                    formatter.Serialize(fs, device);
                    fs.Close();
                    SendDevice(device);
                    Debug.Log("device information successfully registered");

                }catch(Exception e){
                    Debug.Log(e);
                }
            }
        }
        return device.device_id;
    }

    //envia as informações de device para o banco
    private void SendDevice(Device device)
    {
        string payload = ToJSON(device);
        SendAPIRequest("/device", "POST", payload);
    }

    // envia as informações de seção para o banco
    public void StartSession(Session session)
    {
        string payload = ToJSON(session);
        SendAPIRequest("/session", "POST", payload);
    }

    //envia as informações da atividade para o banco
    public string SendActivity(Activity activity)
    {
        string payload = ToJSON(activity);
        SendAPIRequest("/activity", "POST", payload);
        return activity.activity_id;
    }

    // envia as informações para fechar uma seção para o banco
    public void CloseSession()
    {
        System.DateTime currentTime = System.DateTime.Now;
        string payload  = "{\"end_time\" : \""+currentTime.Hour+":"+currentTime.Minute+":"+currentTime.Second+"\"}";
        SendAPIRequest("/session", "PUT", payload);
    }

    //função para envio de dados a API
    private void SendAPIRequest(string endPoint, string method, string payload)
    {
        Debug.Log("request to -> "+method+" : "+endPoint);
        Debug.Log(payload);

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
