var celulas;
var filas = 20;
var columnas = 20;

$(document).ready(function() {
    iniciar_juego(); 
});


//Propiedades de la celula y sus metodos
var Celula = function (data) {
    this.data = data;
    this.x = parseInt(data.attr('data-x'));
    this.y = parseInt(data.attr('data-y'));
    this.estado = parseInt(data.attr('data-estado'));

    this.nuevo_estado = this.estado;
    this.vecinos = [];

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

    this.mostrar_celulas = function() {
        if(this.estado == 0) {
            this.data.removeClass('celula-viva');
        } else {
            this.data.addClass('celula-viva');
        }
    }

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

    this.generar_nuevas_celulas = function() {
        this.estado = this.nuevo_estado;
    }
}


function crear_tablero(fil, col) {
    var elemento;
    var selector;

    //Crear arreglo de la celulas
    celulas = new Array(fil);
    for(var i=0; i<fil; i++) {
        celulas[i] = new Array(col);
    }

    //Crear tablero del juego
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

function configurar_tablero(_celulas) {
    var data;
    var estado;

    for(var k=0; k<filas; k++) {
        for(var l=0; l<columnas; l++) {
            data = $('.celula[data-x="'+k+'"][data-y="'+l+'"]');
            estado = Math.floor(Math.random()*2);
            data.attr('data-estado', estado);
 
            _celulas[k][l] = new Celula(data);
        }
    }

    for(var k=0; k<filas; k++) {
        for(var l=0; l<columnas; l++) {
            _celulas[k][l].obtener_vecinos();
        }
    }
}

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

function bucle() {
    mostrar_nueva_generacion(celulas);
}

function iniciar_juego() {
    console.log('Creando tablero...');
    crear_tablero(filas, columnas);
    console.log('Configurando...');
    configurar_tablero(celulas);
    console.log('Iniciando simulación...');
    setInterval(function(){bucle();},1000/5);
            
}