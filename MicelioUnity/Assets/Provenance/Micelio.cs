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
    private string defaultURL;
    private string port;
    private string token;
    private string device_id;

    // + ":" + this.port 

    //construtor classe Micelio
    public Micelio(string defaultURL, string port, string token)
    {
        this.token = token;
        this.defaultURL = defaultURL;
        this.port = port;
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
        }
        else
        {
            //cria uma instancia de Device para salvar
            string device_id = SystemInfo.deviceUniqueIdentifier;
            string model = SystemInfo.deviceModel;
            int screen_width = Screen.width;
            int screen_height = Screen.height;
            string system_name = SystemInfo.operatingSystem;
            device = new Device(device_id, model, screen_width, screen_height, system_name);

            //teste se todos os campos de Device estão completos
            if (device_id != null && model != null && screen_height != 0 && screen_width != 0 && system_name != null)
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
        SendAPIRequest("/device", "POST", payload);
    }

    //função para envio de dados a API
    public void SendAPIRequest(string endPoint, string method, string payload)
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
