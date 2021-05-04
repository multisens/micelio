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
    public float position_x;
    public float position_y;
	public SerializableDictionary<string, object> attributes;

	public Agent(string id,string name,string type)
	{		
		this.name = name;
		this.type = type;
		this.agent_id = id;
		this.attributes = new Dictionary<string, object>();
		Debug.Log(agent_id);
	}

	public void CreateJSONAttributes()
	{
		
	}

	public static string GenerateAgentID()
	{
	
		System.DateTime currentTime = System.DateTime.Now;
		return "agent-"+currentTime.Day+currentTime.Hour+currentTime.Minute+currentTime.Second+currentTime.Millisecond;		
	}

	public void SetPosition(float x, float y)
	{

		this.position_x = x;
		this.position_y = y;
	}

	public void AddAttributes(string key,object value)
	{
		this.attributes.Add(key,value);

	}

	public void SetRole(string role){

		this.role = role;
	}
}
