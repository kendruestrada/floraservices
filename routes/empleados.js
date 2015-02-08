/**
* Servicio Rest de las empleados.
* Sirve para realizar operaciones CRUD sobre las empleados.  
*/
var express = require('express');
var router = express.Router();


/**
* Varaible del servicio simula una tabla de BD de empleados en esta se grabaran las empleados
* ingresadas al servicio.
* 
*/
empleados = new Array();

/**
* Obtiene el listado de empleados.
* Se puede enviar en distinto formato dependiendo de los 
* formatos aceptados por el solicitante 
*/
router.get('/empleado', function(req, res) {

  res.format({
    html: function(){
	 res.render('empleados',{ empleados: empleados });
    },

    xml: function(){
      res.send(json2xml({empleados:  {empleado: empleados}}));
    },

    json: function(){
      res.json({data: empleados});
    }
  });
});

/**
* Obtiene un empleado.
* Se puede enviar en distinto formato dependiendo de los 
* formatos aceptados por el solicitante 
*/
router.get('/empleado/:codigoempleado', function(req, res) {
  empleadoEncontrado = buscarempleado(req.params.codigoempleado);	
  if(empleadoEncontrado == null){
	console.log("No se encuentra la empleado solicitado");
	res.statusCode = 404;
	res.write(msg);
	res.end();
	return;
  }
  
  
  res.format({
    html: function(){
	 res.render('empleado',{ empleado: empleadoEncontrado });
    },

    xml: function(){
      res.send(json2xml({empleado: empleadoEncontrado}));
    },

    json: function(){
      res.json({data: empleadoEncontrado});
    }
  });
});


/**
* Ingresa un empleado.
* Recibe la empleado en formato json.
* Retorna un mensaje de ok o error en distinto formato dependiendo de los 
* formatos aceptados por el solicitante. Ademas del codigo http correspondiente.
*/
router.post('/empleado', function(req, res) {
console.log(req.body);
  
  
  console.log(buscarempleado(req.body.codigo));
  console.log("codigo suc:" + req.body.codigo);
  if(buscarempleado(req.body.codigo) != null){
	console.log("El empleado ya existe se retorna error ");
	noPermitido("Se Intenta ingresar una empleado existente",res);
	return;
  }
  

  var empleado = {
    "codigo": req.body.codigo,
    "nombre": req.body.nombre,    
    "apellidoPaterno": req.body.apellidoPaterno,
    "apellidoMaterno": req.body.apellidoMaterno,
	
    "rut": {
      "rut": req.body.rut,
      "dv": req.body.dv,
    },
    "cargo": req.body.cargo,
    "urlimagen": req.body.urlimagen,
  };
  
  empleados.push(empleado);
  res.json({ resultado: 'Ok' });
});

/**
* Modifica una empleado.
* Recibe el identificador de la empleadoe en formato json.
* Retorna un mensaje de ok o error en distinto formato dependiendo de los 
* formatos aceptados por el solicitante. Ademas del codigo http correspondiente.
*/
router.put('/empleado/:codigoempleado', function(req, res) {
  var sucAModificar = buscarempleado(req.params.codigoempleado);
  if( sucAModificar == null){
	console.log("la empleado no existe se retorna error ");
	console.log("No se encuentra la empleado solicitada");
	res.statusCode = 404;
	res.write("No se encuentra la empleado solicitada");
	res.end();
	return;	
  }
  sucAModificar.nombre = req.body.nombre;
  sucAModificar.apellidoPaterno = req.body.apellidoPaterno;
  sucAModificar.apellidoMaterno = req.body.apellidoMaterno;

  sucAModificar.rut.rut = req.body.rut;
  sucAModificar.rut.dv = req.body.dv;
  sucAModificar.cargo = req.body.cargo;
  sucAModificar.urlimagen = req.body.urlimagen;


  res.json({ resultado: 'Ok' });
});

/**
* Elimina un empleado.
* Recibe el identificador de la empleadoe en formato json.
* Retorna un mensaje de ok o error en distinto formato dependiendo de los 
* formatos aceptados por el solicitante. Ademas del codigo http correspondiente.
*/
router.delete('/empleado/:codigoempleado', function(req, res) {
  indice = buscarIndiceempleado(req.params.codigoempleado);	
  if(indice == -1){
	console.log("No se encuentra el empleado solicitada");
	res.statusCode = 404;
	res.write("No se encuentra el empleado solicitada");
	res.end();
	return;
  }else{
	empleados.splice(indice,1);
	res.json({ resultado: 'Ok' });
  }
});



function buscarempleado( codigoempleado){
 console.log("num empleados:" + empleados.length);
  for(i = 0; i < empleados.length;i++){
  empl=empleados[i];
	console.log(empl.codigo);
	if(codigoempleado == empl.codigo){
		return empl;
	}
  }
  return null;
}

function buscarIndiceempleado( codigoempleado){
 console.log("num empleados:" + empleados.length);
  for(i = 0; i < empleados.length;i++){
  empl=empleados[i];
	if(codigoempleado == empl.codigo){
		console.log("empleadoe en contrada en el indice:" + i);
		return i;
	}
  }
  return -1;
}


function noPermitido(msg, resp) {
	resp.statusCode = 405;
	resp.write(msg);
	resp.end();
}

/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/
function json2xml(o, tab) {
   var toXml = function(v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += ind + toXml(v[i], name, ind+"\t") + "\n";
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += ind + "<" + name;
         for (var m in v) {
            if (m.charAt(0) == "@")
               xml += " " + m.substr(1) + "=\"" + v[m] + "\"";
            else
               hasChild = true;
         }
         xml += hasChild ? ">" : "/>";
         if (hasChild) {
            for (var m in v) {
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if (m.charAt(0) != "@")
                  xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
         }
      }
      else {
         xml += ind + "<" + name + ">" + v +  "</" + name + ">";
         xml += ind + "<" + name + ">" + v +  "</" + name + ">";
      }
      return xml;
   }, xml="";
   for (var m in o)
      xml += toXml(o[m], m, "");
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}

module.exports = router;
