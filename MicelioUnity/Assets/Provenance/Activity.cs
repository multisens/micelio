using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class Activity
{
	public string activity_id;
    public string name;
    public string time;
    public float position_x;
    public float position_y;
    public string influenced_by;
	public Dictionary<string, object> attributes;
	public Agent []agents;
	public Entity []entities;

	private Activity(){

	}

	public string CreateActivity(){

		return GenerateActivityID();
	}

	private string GenerateActivityID()
	{

		System.DateTime currentTime = System.DateTime.Now;
		return "activity-"+currentTime.Day+currentTime.Hour+currentTime.Minute+currentTime.Second+currentTime.Millisecond;		
	}

	public void SetPosition(float x, float y){

		this.position_x = x;
		this.position_y = y;
	}

	public void SetInfluence(string activity_id){

		this.influenced_by = activity_id;
	}  

	public void AddAttributes(string key,object value)
	{
		
		this.attributes.Add(key,value);
	} 

	public void AddEntity(){

	}

	public void AddAgent(){
		
	}

	public string toJSON()
	{
		return JsonUtility.ToJson(this);
	}
}
