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

    public Soldado(int poder, double peso)
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

    public Agent GetAgent()
    {   
        Entity e = new Entity(id_entity, nome);
		e.AddProperty("poder", poder);
        e.AddProperty("peso", peso);
        return e;

    }
}