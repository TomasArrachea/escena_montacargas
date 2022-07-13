function initMenu(escena) {
	var app = {
		tipoSuperficie: 'barrido',
		forma2dBarrido: 'B1',
		forma2dRevolucion: 'A1',
		angulo: 0,
		textura: 'patron1',
		generarImpresion: function () {
			if (this.tipoSuperficie == 'barrido') {
				escena.generarImpresion(this.tipoSuperficie, this.forma2dBarrido, this.textura + '.png', this.angulo);
			} else {
				escena.generarImpresion(this.tipoSuperficie, this.forma2dRevolucion, this.textura + '.png', 0);
			}
		},
		verComandos: function () {
			window.open('https://calico-transport-086.notion.site/Escena-montacargas-036b4ee633734976baa7fe22efabc107');
		}
	};
	var gui = new dat.GUI();

	var instrucciones = gui.addFolder('Instrucciones');
	instrucciones.add(app, "verComandos").name('Ver instrucciones');
	
	var impresora = gui.addFolder('Impresora');
	var controllerBarrido, controllerRev, controllerAngulo;

	impresora.add(app, "generarImpresion").name('GENERAR IMPRESIÓN');
	impresora.add(app, "textura", ['patron1', 'patron2', 'patron3', 'patron4', 'patron5', 'patron6', 'patron7']).name('Textura');
	impresora.add(app, "tipoSuperficie", ["barrido", "revolucion"]).name('Tipo de superficie').onFinishChange(function (value) {
		if (value == 'barrido') {
			if (controllerRev)
				controllerRev.remove();
			controllerBarrido = impresora.add(app, "forma2dBarrido", ["B1", "B2", "B3", "B4"]).name('Forma de barrido');
			controllerAngulo = impresora.add(app, "angulo", 0, 360).step(1).name('Ángulo de torsión');

		} else {
			if (controllerBarrido)
				controllerBarrido.remove();
			if (controllerAngulo)
				controllerAngulo.remove();
			controllerRev = impresora.add(app, "forma2dRevolucion", ["A1", "A2", "A3", "A4"]).name('Forma de revolución');
		}
	}).setValue('barrido');
	impresora.open();

	gui.width = 300;

};

export { initMenu }