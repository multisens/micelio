using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class Entity
{
    public string entity_id;
    public string name;
    public string role;
    public float position_x;
    public float position_y;
	public Dictionary<string,object> attributes;

	public Entity(string name){

		this.name = name;
		this.attributes = new Dictionary<string, object>();
	}

	public void SetPosition(float x, float y){

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
