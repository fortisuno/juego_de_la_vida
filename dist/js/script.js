/*
*   Script: Juego de la vida
*   Autor: Pablo Arturo Gómez Morales
*/

//parametros del juego
var celulas;
var vida;
var generaciones;
var ciclo;

var filas = 20;
var columnas = 20;

var tablero_flag = false;
var celulas_flag = false;


$(document).ready(function() {
       
    //Boton que genera la tabla
    $('#btn-generar').on('click', function(e) {
        e.preventDefault();
        checar_tablero();
        
        columnas = parseInt($('input:text[name=valor]').val());
        filas = parseInt($('input:text[name=valor]').val());

        if (filas >= 5 && columnas >= 5 || filas <= 50 && columnas <= 50) {
            
            console.log('Generando tabla...');
            console.log(
                'Ancho: '+columnas+'\n'+
                'Alto: '+filas+'\n'
            );
    
            crear_tablero(filas, columnas);
            celulas_flag = true;
            

            $('.celula').on('click', function() {
                if(celulas_flag) {
                    var estado = $(this).attr('data-estado');
                    if(estado == 0) {
                        $(this).addClass('celula-viva');
                        estado = 1;
                    } else {
                        $(this).removeClass('celula-viva');
                        estado = 0;
                    }
                    $(this).attr('data-estado', estado);
                }
            });
        } else {
            alert("Introduce un valor entero entre 5 y 50");
        }
    });


    //Boton que inicia el juego
    $('#btn-iniciar').on('click', function(e) {
        e.preventDefault();
        celulas_flag = false;
        generaciones = 0;

        console.log('Configurando tablero...');
        configurar_tablero(celulas);
        console.log('Iniciando simulación...');
        ciclo = setInterval(function(){bucle();},1000/5);
    });

    //Boton que para el juego
    $('#btn-detener').on('click', function(e) {
        clearInterval(ciclo);

    });


});


//Propiedades de la celula y sus metodos
var Celula = function (data) {
    this.data = data;
    this.x = parseInt(data.attr('data-x'));
    this.y = parseInt(data.attr('data-y'));
    this.estado = parseInt(data.attr('data-estado'));

    this.nuevo_estado = this.estado;
    this.vecinos = [];

    //Calcula sus vecinos
    this.obtener_vecinos = function() {
        var _x;
        var _y;

        for(var i=-1; i<=1; i++) {
            for(var j=-1; j<=1; j++) {
                _x = (this.x + j + columnas)%columnas;
                _y = (this.y + i + filas)%filas;

                if(i != 0 || j != 0) {
                    this.vecinos.push(celulas[_x][_y]);
                }
            }
        }
    }

    //Muestra las celulas vivas en la tabla
    this.mostrar_celulas = function() {
        if(this.estado == 0) {
            this.data.removeClass('celula-viva');
        } else {
            this.data.addClass('celula-viva');
        }
    }

    //Calcula es nuevo estado
    this.obtener_estado = function() {
        var cont = 0;

        for(var i=0; i<this.vecinos.length; i++) {
            cont += this.vecinos[i].estado;
        }

        if(cont <2 || cont>3){
            this.nuevo_estado = 0;
        } else if(cont == 3){
            this.nuevo_estado = 1;
        }
    }

    //Asigna el nuevo estado
    this.generar_nuevas_celulas = function() {
        this.estado = this.nuevo_estado;
    }
}

//crea la tabla html
function crear_tablero(fil, col) { 
    var elemento;
    var selector;

    celulas = new Array(fil);
    for(var i=0; i<fil; i++) {
        celulas[i] = new Array(col);
    }

    for(var i=0; i<fil; i++) {
        selector = $('#tablero');
        elemento = '<div class="row" data-row = "'+i+'"></div>';
        selector.append(elemento);
        for(var j=0; j<col; j++) {
            selector = $('#tablero > [data-row = "'+i+'"]');
            elemento = '<div class="celula border" data-x="'+i+'" data-y="'+j+'" data-estado="0"></div>';
            selector.append(elemento);
        }
    }
}

//Verifica si es la primera tabla que se genera o si no borra la actual y genera una nueva
function checar_tablero() {
    var selector;

    if(!tablero_flag) {
        tablero_flag = true;
    } else {
        console.log('Borrando tablero...');
        selector = $('#tablero');
        selector.empty();
    }
}

//Almacena las celulas en el arreglo
function configurar_tablero(_celulas) {
    var data;
    var estado;

    for(var k=0; k<filas; k++) {
        for(var l=0; l<columnas; l++) {
            data = $('.celula[data-x="'+k+'"][data-y="'+l+'"]');
            //  Para que inicie aleatoriamente se usan estas 2 lineas:
            //  estado = Math.floor(Math.random()*2);
            //  data.attr('data-estado', estado);
 
            _celulas[k][l] = new Celula(data);
        }
    }

    for(var k=0; k<filas; k++) {
        for(var l=0; l<columnas; l++) {
            _celulas[k][l].obtener_vecinos();
        }
    }
}

//Muestra las nuevas generaciones de celulas
function mostrar_nueva_generacion(_celulas) {
    for(var k=0; k<filas; k++) {
        for(var l=0; l<columnas; l++) {
            _celulas[k][l].mostrar_celulas();
        }
    }
    for(var k=0; k<filas; k++) {
        for(var l=0; l<columnas; l++) {
            _celulas[k][l].obtener_estado();
        }
    }
    for(var k=0; k<filas; k++) {
        for(var l=0; l<columnas; l++) {
            _celulas[k][l].generar_nuevas_celulas();
        }
    }
}

//Cuenta cuantas celulas estan vivas
function contar_vida(_celulas) {
    vida = 0;

    for(var k=0; k<filas; k++) {
        for(var l=0; l<columnas; l++) {
            vida += _celulas[k][l].estado;
        }
    }
    $('#vida').text(vida);
}

//Es el bucle del juego
function bucle() {
    contar_vida(celulas);
    mostrar_nueva_generacion(celulas);
    generaciones++;
    $('#generaciones').text(generaciones);
    console.log(generaciones);
}

//Inicializa todo en caso de hacerlo automatico
function iniciar_juego() {
    console.log('Creando tablero...');
    crear_tablero(filas, columnas);
    console.log('Configurando...');
    configurar_tablero(celulas);
    console.log('Iniciando simulación...');
    setInterval(function(){bucle();},1000/5);
            
}