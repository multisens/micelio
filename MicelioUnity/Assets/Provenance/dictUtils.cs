using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Text.RegularExpressions;



public class dictUtils
{

    public static string CreateJSONAttributes(Dictionary<string, object> dict)
    {
        string p = "{";
        int i = 0;

        foreach (KeyValuePair<string, object> entry in dict)
        {
            if (i == 0)
            {
                i = 1;
            }
            else
            {
                p = p + ", ";
            }

            p = p + "\"" + entry.Key + "\":";

            //Type t = entry.Value.GetType();
            // if (t.IsArray)
            // {
            //     string a = "";
            //     int i2 = 0;

            //     foreach (object o in entry.Value)
            //     {
            //         if (i2 == 0)
            //         {
            //             i2 = 1;
            //         }
            //         else
            //         {
            //             p = p + ", ";
            //         }
            //         a = a + o.ToString();
            //     }

            //     p = p + "[" + a + "]";
            // }
            if (Regex.IsMatch(entry.Value.ToString(), @"^(-?)(0|([1-9][0-9]*))(\,|\.)([0-9]+)?$"))
            {
                p = p + entry.Value.ToString();
            }
            else
            {
                p = p + "\"" + entry.Value.ToString() + "\"";
            }

        }

        p = p + "}";

        return p;
    }

}