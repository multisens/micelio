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
	public var influenced_by_attributes;
	public var attributes;

	private Activity(){

	}

	public string CreateActivity(){
		// retornar o id da atividade criada
	}

	public void SetPosition(float x, float y){

	}

	public void SetInfluence(string activity_id, var attributes){

	}  

	public void SetAttributes(var attributes){

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
