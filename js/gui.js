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
				escena.generarImpresion(this.tipoSuperficie, this.forma2dRevolucion, this.textura  + '.png', 0);
			}
		}
	};
	var gui = new dat.GUI();

	gui.add(app, "tipoSuperficie", ["barrido", "revolucion"]);
	gui.add(app, "forma2dRevolucion", ["A1", "A2", "A3", "A4"]);
	gui.add(app, "forma2dBarrido", ["B1", "B2", "B3", "B4"]);
	gui.add(app, "angulo", 0, 360).step(1);
	gui.add(app, "textura", ['patron1', 'patron2', 'patron3', 'patron4', 'patron5', 'patron6', 'patron7']);
	gui.add(app, "generarImpresion");
};

export { initMenu }