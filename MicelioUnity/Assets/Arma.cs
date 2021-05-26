using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class Arma : MonoBehaviour, EntityObject
{
    private string id_entity = Entity.GenerateEntityID();
    public string nome = "Arma";
    public double peso;
    public int poder ;

    public Arma(int poder, double peso)
    {
        this.poder = poder;
        this.peso = peso;
    }

    void Start()
    {    

    }

    void Update()
    {
        
    }

    public Entity GetEntity()
    {   
        Entity e = new Entity(id_entity, nome);
		e.AddProperty("poder", poder);
        e.AddProperty("peso", peso);
        e.SetRole("objeto");
        return e;

    }
}