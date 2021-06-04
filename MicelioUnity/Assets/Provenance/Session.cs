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
	public string session_group;
	public string start_time;
	public string end_time;	
   
   	public Session(string language, string game_stage)
   	{

		System.DateTime currentTime = System.DateTime.Now;
	   	this.language = language;
	   	this.game_stage = game_stage;
	   	this.date = currentTime.Year+"-"+currentTime.Month+"-"+currentTime.Day;
		this.start_time = currentTime.Hour+":"+currentTime.Minute+":"+currentTime.Second;
		
  	}

  	public void SetSessionGroup(string session_group)
	{
		this.session_group = session_group;
	}

	public void SetName(string name)
	{
		this.name = name;
	}
}
