using System.Collections;
using System.Collections.Generic;
using UnityEngine; 
using UnityEngine.Serialization; 

[System.Serializable]
public class Agent
{
    public string agent_id;
    public string name;
    public string role;
    public string type;
    public double position_x;
    public double position_y;
	public Dictionary<string, object> properties;

	public Agent(string id,string name,string type)
	{	

		this.name = name;
		this.type = type;
		this.agent_id = id;
		this.properties = new Dictionary<string, object>();

	}

	public static string GenerateAgentID()
	{
		System.DateTime currentTime = System.DateTime.Now;
		return "agent-"+currentTime.Day+currentTime.Hour+currentTime.Minute+currentTime.Second+currentTime.Millisecond;		
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
