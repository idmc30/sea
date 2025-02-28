function modalOrganizadores(idEvento) {

    listarOrganizadores(idEvento);
}

var listarOrganizadores = function(idEvento) {

    var options = {
        type: 'POST',
        url: 'index.php?page=eventoConsulta&action=listarOrganizadores',
        data: {
            'codEvento': idEvento,
        },
        dataType: 'html',
        success: function(response) {
            $("#modalOrganizadores").html(response)
            $('#modal_organizadores').modal('show');

        }
    };
    $.ajax(options);
};

$(document).ready(function() {
    $('.fechas').datepicker({
        language: "es",
        autoclose: true,
        todayHighlight: true
    });
});

var mostrareventos = function(fecha_inicial, fecha_final) {

    var options = {
        type: 'POST',
        url: 'index.php?page=eventoConsulta&action=listareventosConsulta',
        data: {
            'fecha_inicial': fecha_inicial,
            'fecha_final': fecha_final,
        },
        dataType: 'html',
        success: function(response) {
            $('#exportarEventos').attr('href', "index.php?page=eventoConsulta&action=exportarEventos&fecha_inicial=" + fecha_inicial + "&fecha_final=" + fecha_final);
            $('#tabladt').dataTable().fnDestroy();
            $('#tabla_busqueda').html(response);
            $('#tabladt').DataTable({

                "language": spanish_datatable
            });
        }
    };
    $.ajax(options);
};

$(document).on('click', '#btn_mostrar', function(event) {
    event.preventDefault();

    var fecha_inicial = $('#fecha_inicial').val();
    var fecha_final = $('#fecha_final').val();

    var splitFechaInicial = fecha_inicial.split('/');
    var splitFechaFinal = fecha_final.split('/');

    var anioFechInicial = splitFechaInicial[2];
    var mesFechInicial = splitFechaInicial[1];
    var diaFechaInicial = splitFechaInicial[0];

    var anioFechFinal = splitFechaFinal[2];
    var mesFechFinal = splitFechaFinal[1];
    var diaFechaFinal = splitFechaFinal[0];

    var objFechaInicial = new Date(anioFechInicial, mesFechInicial, diaFechaInicial);
    var objFechaFinal = new Date(anioFechFinal, mesFechFinal, diaFechaFinal);

    var FechaFinal = objFechaFinal.getTime();
    var FechaInicial = objFechaInicial.getTime();

    if (FechaFinal < FechaInicial) {

        swal({
            title: 'La fecha final no puede ser menor a la fecha Inicial',
            icon: 'warning',
            allowOutsideClick: false,
        })

    } else {


        if (isNaN(FechaFinal) || isNaN(FechaInicial)) {

            swal({
                title: 'Debe Ingresar una Fecha valida',
                icon: 'warning',
                allowOutsideClick: false,
            })

        } else {
            mostrareventos(fecha_inicial, fecha_final);
        }
    }

});



$(document).ready(() => {

    $("#frmOrganizador").validate({
        rules: {
            cmbtipoorga: 'required',
            txtnombre: 'required'


        },
        messages: {
            cmbtipoorga: 'Debe seleccionar un tipo de organizador',
            txtnombre: 'Debe ingresar un nombre',


        }
    });

});