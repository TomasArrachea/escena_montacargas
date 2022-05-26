function initMenu(escena) {
	var app = {
		tipoSuperficie: 'barrido',
		forma2dBarrido: 'B1',
		forma2dRevolucion: 'A1',
		angulo: 0,
		generarImpresion: function() {
			let impresora = escena.getImpresora();
			if (tipoSuperficie == 'barrido') {
				impresora.generarImpresion(tipoSuperficie, forma2dBarrido, angulo/2*Math.PI);
			} else {
				impresora.generarImpresion(tipoSuperficie, forma2dRevolucion, angulo/2*Math.PI);
			}
		}		
	};
	var gui = new dat.GUI();

	gui.add(app, "tipoSuperficie",["barrido","revolucion"]);
	gui.add(app, "forma2dRevolucion",["A1","A3","A3","A4"]);
	gui.add(app, "forma2dBarrido",["B1","B3","B3","B4"]);
	gui.add(app, "angulo",0, 360).step(1);
	gui.add(app, "generarImpresion");
};

export {initMenu}