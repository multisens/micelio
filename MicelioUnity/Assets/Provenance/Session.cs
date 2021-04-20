using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class Session
{

	public string name;
	public string language;
	public string game_stage;
	public string date;
	public string observation_environment;
	public string start_time;
	public string end_time;	
   
   	public Session(string language, string game_stage)
   	{

	   	this.language = language;
	   	this.game_stage = game_stage;
	   	this.date = System.DateTime.Now.Date.ToString();
		this.start_time = System.DateTime.Now.ToString();
  	}

  	public void setObservationEnvironment(string observation_environment)
	{
		this.observation_environment = observation_environment;
	}

	public void setName(string name)
	{
		this.name = name;
	}

	public string toJSON()
	{
		return JsonUtility.ToJson(this);
	}
}
