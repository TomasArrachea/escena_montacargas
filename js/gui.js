

function generarImpresion() {
        /*
        let impresora = objects[1];
        if (tipoSuperficie == 'barrido') {
                impresora.generarImpresion(tipoSuperficie, forma2dbarrido, angulo);
        } else {
                impresora.generarImpresion(tipoSuperficie, forma2dRevolucion, angulo);
        }
        */
}


function initMenu() {
        var tipoSuperficie = 'barrido';
        var forma2dBarrido = 'B1';
        var forma2dRevolucion = 'A1';
        var angulo = 0;
        var generarImpresion = () => {return true};

        var gui = new dat.GUI();
        gui.add(window, "tipoSuperficie",["barrido","revolucion"]).name("Tipo de superficie");
        gui.add(window, "forma2dRevolucion",["A1","A3","A3","A4"]).name("Forma 2D de revolución");
        gui.add(window, "forma2dBarrido",["B1","B3","B3","B4"]).name("Forma 2D de barrido");
        gui.add(window, "angulo",0, 360).step(1).name("Angulo");
        gui.add(window, "generarImpresion").name("Generar");
};

export {initMenu}