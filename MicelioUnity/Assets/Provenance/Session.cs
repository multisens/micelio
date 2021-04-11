using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class Session
{
   

	public string toJSON()
	{
		return JsonUtility.ToJson(this);
	}
}
