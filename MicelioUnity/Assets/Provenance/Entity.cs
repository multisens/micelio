using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class Entity
{
    public string entity_id;
    public string name;
    public string role;
    public double position_x;
    public double position_y;
	public Dictionary<string, object> properties;

	public Entity(string id, string name)
	{

		this.entity_id = id;
		this.name = name;
		this.properties = new Dictionary<string, object>();

	}

	public static string GenerateEntityID()
	{
		System.DateTime currentTime = System.DateTime.Now;
		return "entity-"+currentTime.Day+currentTime.Hour+currentTime.Minute+currentTime.Second+currentTime.Millisecond;		
	}

	public void SetPosition(double x, double y)
	{
		this.position_x = x;
		this.position_y = y;
	}

	public void AddProperty(string key,object value)
	{
		this.properties.Add(key,value);
	}

	public void SetRole(string role)
	{
		this.role = role;
	}

}
