using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class Espada : EntityFactory
{
    private string id_entity = Entity.GenerateEntityID();
    public string nome = "Espada";
    public double peso;
    public float poder ;

    public Espada(float poder, double peso)
    {
        this.poder = poder;
        this.peso = peso;
    }

    public Entity GetEntity()
    {   
        Entity e = new Entity(id_entity, nome);

		e.AddProperty("poder", poder);
        e.AddProperty("peso", peso);
        
        return e;
    }
}



