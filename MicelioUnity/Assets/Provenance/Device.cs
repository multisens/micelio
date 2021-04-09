using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Device
{
   
	private string device_id;
	private string model;
	private int screen_width;
	private int screen_height;
	private string system_name; 

	//construtor da classe Device
	public Device(string device_id, string model,int screen_width,int screen_height,string system_name)
	{
		this.device_id = device_id;
		this.model = model;
		this.screen_width = screen_width;
		this.screen_height = screen_height;
		this.system_name = system_name;
	}

	public string toJSON()
	{
		return "";
	}
}
