// Prepara el Inicio del juego
$(function() {
	iniJuego();
});
// da inicio el juego
function iniJuego() {
	CambiarColor('h1.main-titulo');
	$('.btn-reinicio').click(function () {
		if ($(this).text() === 'Reiniciar') {
			location.reload(true);
		}
		llenarTablero();//pone los elemento caramelo en el tablero
		$(this).text('Reiniciar');
		$('#timer').startTimer({
			onComplete: finJuego
		})
	});
}
//punto 1. cambia de color después de determinado tiempo, posteriormente
// vuelva al color original, y permanezca cambiando entre dos colores indefinidamente.
function CambiarColor(selector) {
	$(selector).animate({
			opacity: '1',
		}, {
			step: function () {
				$(this).css('color', 'white');
			},
			queue: true
		})
		.animate({
			opacity: '1'
		}, {
			step: function () {
				$(this).css('color', 'yellow');
			},
			queue: true
		}, 600)
		.delay(1000)
		.animate({
			opacity: '1'
		}, {
			step: function () {
				$(this).css('color', 'white');
			},
			queue: true
		})
		.animate({
			opacity: '1'
		}, {
			step: function () {
				$(this).css('color', 'yellow');
				CambiarColor('h1.main-titulo');
			},
			queue: true
		});
}
//punto 4 y 6. temporizador y boton reiniciar
//cambia el aspecto de la página final del juego
function finJuego() {
	$('div.panel-tablero, div.time').effect('fold');
	$('h1.main-titulo').addClass('title-over')
		.text('Muchas Gracias por jugar!');
	$('div.score, div.moves, div.panel-score').width('100%');

}
//pone los elemento caramelo en el tablero
function llenarTablero(){
	var top = 6;
	var column = $('[class^="col-"]');
  	column.each(function () {
		var caramelo = $(this).children().length;
		var agrega = top - caramelo;
		for (var i = 0; i < agrega; i++) {
			var tipoDulce = aleatorios(1, 5);//punto 2. funcion para generar números aleatorios
			if (i === 0 && caramelo < 1) {
				$(this).append('<img src="image/' + tipoDulce + '.png" class="element"></img>');
			} else {
				$(this).find('img:eq(0)').before('<img src="image/' + tipoDulce + '.png" class="element"></img>');
			}
		}
	});
	iteracionEvento();//efecto de movimiento entre los caramelos
	validadorEvento();// Valida Si hay dulces que borrar
}
//punto 7. interacción del usuario con el elemento caramelo es drag and drop
//efecto de movimiento entre los caramelos
function iteracionEvento() {
	$('img').draggable({
		containment: '.panel-tablero',
		droppable: 'img',
		revert: true,
		revertDuration: 500,
		grid: [100, 100],
		zIndex: 10,
		drag: moviSolido
	});
	$('img').droppable({
		drop: intercambiar
	});
	habilitarEvento();
}
//hace que el caramelo sea solido al moverse
function moviSolido(event, dulceDrag) {
	dulceDrag.position.top = Math.min(100, dulceDrag.position.top);
	dulceDrag.position.bottom = Math.min(100, dulceDrag.position.bottom);
	dulceDrag.position.left = Math.min(100, dulceDrag.position.left);
	dulceDrag.position.right = Math.min(100, dulceDrag.position.right);
}
//habilitar Evento
function habilitarEvento() {
	$('img').draggable('enable');
	$('img').droppable('enable');
}
function inhabilitarEvento() {
	$('img').draggable('disable');
	$('img').droppable('disable');
}
//reemplaza a los caramelos anteriores
function intercambiar(event, dulceDrag) {
	var dulceDrag = $(dulceDrag.draggable);
	var dragSrc = dulceDrag.attr('src');
	var dulceDrop = $(this);
	var dropSrc = dulceDrop.attr('src');
	dulceDrag.attr('src', dropSrc);
	dulceDrop.attr('src', dragSrc);
	setTimeout(function () {//Debes usar la función setTimeout de JavaScript para retrasar la ejecución de funciones según un tiempo determinado, con el fin de darle un orden a las animaciones y acciones que interactúan en el juego.
		llenarTablero();
		if ($('img.delete').length === 0) {
			dulceDrag.attr('src', dragSrc);
			dulceDrop.attr('src', dropSrc);
		} else {
			actualizaPuntacion();//valida la puntuacion por cantidad de elementos en linea
		}
	}, 500);

}
//valida la puntuacion por cantidad de elementos en linea
function actualizaPuntacion() {
	var actualValue = Number($('#movimientos-text').text());
	var result = actualValue += 1;
	$('#movimientos-text').text(result);
}
//punto 2. funcion para generar números aleatorios
function aleatorios(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
// obtiene filas de dulces o columas
function obtieneArrays(arrayType, index) {
	var dulceCol1 = $('.col-1').children();
	var dulceCol2 = $('.col-2').children();
	var dulceCol3 = $('.col-3').children();
	var dulceCol4 = $('.col-4').children();
	var dulceCol5 = $('.col-5').children();
	var dulceCol6 = $('.col-6').children();
	var dulceCol7 = $('.col-7').children();
	var arregloColumns = $([dulceCol1, dulceCol2, dulceCol3, dulceCol4,
		dulceCol5, dulceCol6, dulceCol7
	]);

	if (typeof index === 'number') {
		var filaDulce = $([dulceCol1.eq(index), dulceCol2.eq(index), dulceCol3.eq(index),
			dulceCol4.eq(index), dulceCol5.eq(index), dulceCol6.eq(index),
			dulceCol7.eq(index)
		]);
	} else {
		index = '';
	}
	if (arrayType === 'columns') {
		return arregloColumns;
	} else if (arrayType === 'rows' && index !== '') {
		return filaDulce;
	}
}
// arreglos de filas
function arregloFilas(index) {
	var filaDulce = obtieneArrays('rows', index);
	return filaDulce;
}
// arreglos de colunmnas
function arregloColumns(index) {
	var columnsDulces = obtieneArrays('columns');
	return columnsDulces[index];
}
//eliminacion automatica de los elementos
// Valida Si hay dulces que borrar
function validadorEvento() {
	validaColumna();
	validaFila();
	// Si hay dulces que borrar
	if ($('img.delete').length !== 0) {
		borraDulceTablero();
	}
}
function borraDulceTablero() {
	inhabilitarEvento();
	$('img.delete').effect('pulsate', 400);
	$('img.delete').animate({
			opacity: '0'
		}, {
			duration: 300
		})
		.animate({
			opacity: '0'
		}, {
			duration: 400,
			complete: function () {
				borraElement()//borra imagen de caramelos
					.then(comprobarllenado)
					.catch(llenarEspacios);
			},
			queue: true
		});
}
//llenado automatico de los espacios con elementos
function llenarEspacios(error) {
	console.log(error);
}
function comprobarllenado(result) {
	if (result) {
		llenarTablero();
	}
}
//borra imagen de caramelos
function borraElement() {
	return new Promise(function (resolve, reject) {
		if ($('img.delete').remove()) {
			resolve(true);
		} else {
			reject('No se pudo eliminar Dulce...');
		}
	})
}
//punto 3. Valida si hay dulces que se eliminarán en una columna
function validaColumna() {
	for (var j = 0; j < 7; j++) {
		var counter = 0;
		var posicionDulce = [];
		var extraposicionDulce = [];
		var columnsDulces = arregloColumns(j);
		var comparisonValue = columnsDulces.eq(0);
		var gap = false;
		for (var i = 1; i < columnsDulces.length; i++) {
			var srcComparison = comparisonValue.attr('src');
			var srcCandy = columnsDulces.eq(i).attr('src');

			if (srcComparison != srcCandy) {
				if (posicionDulce.length >= 3) {
					gap = true;
				} else {
					posicionDulce = [];
				}
				counter = 0;
			} else {
				if (counter == 0) {
					if (!gap) {
						posicionDulce.push(i - 1);
					} else {
						extraposicionDulce.push(i - 1);
					}
				}
				if (!gap) {
					posicionDulce.push(i);
				} else {
					extraposicionDulce.push(i);
				}
				counter += 1;
			}
			comparisonValue = columnsDulces.eq(i);
		}
		if (extraposicionDulce.length > 2) {
			posicionDulce = $.merge(posicionDulce, extraposicionDulce);
		}
		if (posicionDulce.length <= 2) {
			posicionDulce = [];
		}
		conteoDulces = posicionDulce.length;
		if (conteoDulces >= 3) {
			borraColumna(posicionDulce, columnsDulces);
			contador(conteoDulces);
		}
	}
}
function borraColumna(posicionDulce, columnsDulces) {
	for (var i = 0; i < posicionDulce.length; i++) {
		columnsDulces.eq(posicionDulce[i]).addClass('delete');
	}
}
// Valida si hay dulces que deben eliminarse en una fila
function validaFila() {
	for (var j = 0; j < 6; j++) {
		var counter = 0;
		var posicionDulce = [];
		var extraposicionDulce = [];
		var filaDulce = arregloFilas(j);
		var comparisonValue = filaDulce[0];
		var gap = false;
		for (var i = 1; i < filaDulce.length; i++) {
			var srcComparison = comparisonValue.attr('src');
			var srcCandy = filaDulce[i].attr('src');

			if (srcComparison != srcCandy) {
				if (posicionDulce.length >= 3) {
					gap = true;
				} else {
					posicionDulce = [];
				}
				counter = 0;
			} else {
				if (counter == 0) {
					if (!gap) {
						posicionDulce.push(i - 1);
					} else {
						extraposicionDulce.push(i - 1);
					}
				}
				if (!gap) {
					posicionDulce.push(i);
				} else {
					extraposicionDulce.push(i);
				}
				counter += 1;
			}
			comparisonValue = filaDulce[i];
		}
		if (extraposicionDulce.length > 2) {
			posicionDulce = $.merge(posicionDulce, extraposicionDulce);
		}
		if (posicionDulce.length <= 2) {
			posicionDulce = [];
		}
		conteoDulces = posicionDulce.length;
		if (conteoDulces >= 3) {
			borraFila(posicionDulce, filaDulce);
			contador(conteoDulces);
		}
	}
}
function borraFila(posicionDulce, filaDulce) {
	for (var i = 0; i < posicionDulce.length; i++) {
		filaDulce[posicionDulce[i]].addClass('delete');
	}
}
//contador de puntuacion muestra la puntuacion
function contador(conteoDulces) {
	var score = Number($('#score-text').text());
	switch (conteoDulces) {
		case 3:
			score += 25;
			break;
		case 4:
			score += 50;
			break;
		case 5:
			score += 75;
			break;
		case 6:
			score += 100;
			break;
		case 7:
			score += 200;
	}
	$('#score-text').text(score);
}
