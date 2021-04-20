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
	public string influenced_by_attributes;
	public string attributes;
	public Agent []agents;
	public Entity []entities;

	private Activity(){

	}

	public string CreateActivity(){
		return "bala";
		// retornar o id da atividade criada
	}

	public void SetPosition(float x, float y){

	}

	public void SetInfluence(string activity_id, string attributes){

	}  

	public void SetAttributes(string attributes){

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
