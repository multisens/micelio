using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class Arma : EntityFactory
{
    public string nome = "Arma";
    public double peso;
    public float poder ;

    public Arma(float poder, double peso)
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
        Entity e = new Entity(nome);
		e.AddProperty("poder", poder);
        e.AddProperty("peso", peso);
        return e;

    }
}