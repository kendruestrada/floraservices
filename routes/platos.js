/**
* Servicio Rest de las platos.
* Sirve para realizar operaciones CRUD sobre las platos.  
*/
var express = require('express');
var router = express.Router();


/**
* Varaible del servicio simula una tabla de BD de platos en esta se grabaran las platos
* ingresadas al servicio.
* 
*/
platos = new Array();

/**
* Obtiene el listado de platos.
* Se puede enviar en distinto formato dependiendo de los 
* formatos aceptados por el solicitante 
*/
router.get('/plato', function(req, res) {

  res.format({
    html: function(){
	 res.render('platos',{ platos: platos });
    },

    xml: function(){
      res.send(json2xml({platos:  {plato: platos}}));
    },

    json: function(){
      res.json({data: platos});
    }
  });
});

/**
* Obtiene un plato.
* Se puede enviar en distinto formato dependiendo de los 
* formatos aceptados por el solicitante 
*/
router.get('/plato/:codigoplato', function(req, res) {
  platoEncontrado = buscarplato(req.params.codigoplato);	
  if(platoEncontrado == null){
	console.log("No se encuentra la plato solicitado");
	res.statusCode = 404;
	res.write(msg);
	res.end();
	return;
  }
  
  
  res.format({
    html: function(){
	 res.render('plato',{ plato: platoEncontrado });
    },

    xml: function(){
      res.send(json2xml({plato: platoEncontrado}));
    },

    json: function(){
      res.json({data: platoEncontrado});
    }
  });
});


/**
* Ingresa un plato.
* Recibe la plato en formato json.
* Retorna un mensaje de ok o error en distinto formato dependiendo de los 
* formatos aceptados por el solicitante. Ademas del codigo http correspondiente.
*/
router.post('/plato', function(req, res) {
console.log(req.body);
  
  
  console.log(buscarplato(req.body.codigo));
  console.log("codigo suc:" + req.body.codigo);
  if(buscarplato(req.body.codigo) != null){
	console.log("El plato ya existe se retorna error ");
	noPermitido("Se Intenta ingresar una plato existente",res);
	return;
  }
  

  var plato = {
    "codigo": req.body.codigo,
    "nombre": req.body.nombre,    
    "precio": req.body.precio,
    "descripcion": req.body.descripcion,
    "urlimagen": req.body.urlimagen
  };
  
  platos.push(plato);
  res.json({ resultado: 'Ok' });
});

/**
* Modifica una plato.
* Recibe el identificador de la platoe en formato json.
* Retorna un mensaje de ok o error en distinto formato dependiendo de los 
* formatos aceptados por el solicitante. Ademas del codigo http correspondiente.
*/
router.put('/plato/:codigoplato', function(req, res) {
  var platoAModificar = buscarplato(req.params.codigoplato);
  if( platoAModificar == null){
	console.log("la plato no existe se retorna error ");
	console.log("No se encuentra la plato solicitada");
	res.statusCode = 404;
	res.write("No se encuentra la plato solicitada");
	res.end();
	return;	
  }
  platoAModificar.nombre = req.body.nombre;
  platoAModificar.precio = req.body.precio;
  platoAModificar.descripcion = req.body.descripcion;
  platoAModificar.urlimagen = req.body.urlimagen;


  res.json({ resultado: 'Ok' });
});

/**
* Elimina un plato.
* Recibe el identificador de la platoe en formato json.
* Retorna un mensaje de ok o error en distinto formato dependiendo de los 
* formatos aceptados por el solicitante. Ademas del codigo http correspondiente.
*/
router.delete('/plato/:codigoplato', function(req, res) {
  indice = buscarIndiceplato(req.params.codigoplato);	
  if(indice == -1){
	console.log("No se encuentra el plato solicitada");
	res.statusCode = 404;
	res.write("No se encuentra el plato solicitada");
	res.end();
	return;
  }else{
	platos.splice(indice,1);
	res.json({ resultado: 'Ok' });
  }
});



function buscarplato( codigoplato){
 console.log("num platos:" + platos.length);
  for(i = 0; i < platos.length;i++){
  plt=platos[i];
	console.log(plt.codigo);
	if(codigoplato == plt.codigo){
		return plt;
	}
  }
  return null;
}

function buscarIndiceplato( codigoplato){
 console.log("num platos:" + platos.length);
  for(i = 0; i < platos.length;i++){
  plt=platos[i];
	if(codigoplato == plt.codigo){
		console.log("platoe encontrado en el indice:" + i);
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
