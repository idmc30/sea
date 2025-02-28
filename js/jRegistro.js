function soloNumeros(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = "0123456789";
    especiales = "8-37-39-46";

    tecla_especial = false
    for (var i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
        return false;
    }
};

$(document).on('keyup', '#txtDNI', function(event) {
    if (event.which == 13) {
        term = $('#txtDNI').val();
        document.getElementById('txtCorreo').focus();
        ValidarDNI(term);
    }
});

function ValidarDNI(term) {
    var datax = $('#frmRegistro').serializeArray();
    $.ajax({
            method: "POST",
            url: 'index.php?page=registro&action=consultarPersonaByDNI',
            data: datax
        })
        .done(function(text) {
            var term = text.dni;
            if (text.respuesta != "registrado") {
                VerificarDNI(term);
            } else {
                document.getElementById('txtDNI').focus();
                $('#txtDNI').val('');
                swal({
                    title: 'Usted ya esta registrado',
                    icon: 'warning',
                    timer: 2000,
                    button: false
                }).then(
                    function() {},
                    function(dismiss) {
                        if (dismiss === 'timer') {
                            console.log('I was closed by the timer')
                        }
                    }
                )
            }
        });
}

function VerificarDNI(term) {
    var options = {
        type: 'GET',
        url: "http://172.17.128.37:8043/ws_pj/index.php?page=reniec&action=consultarxdni",
        data: { 'term': term },
        dataType: 'json',
        beforeSend: function() {
            $('#exampleModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#exampleModal').modal('show');

        },
        success: function(response) {
            $('#exampleModal').modal('hide');
            reniec_ws = response;
            $('#txtnombreApellidos').val(response.nombres + ' ' + response.apellidopaterno + ' ' + response.apellidomaterno);
            $("#txtnombres").val(response.nombres);
            $("#txtapeparterno").val(response.apellidopaterno);
            $("#txtapematerno").val(response.apellidomaterno);
        }
    };
    $.ajax(options).fail(function(jqXHR, textStatus, errorThrown) {
        reniec_ws = null;


        let mensaje = "";
        if (jqXHR.status === 0) {

            // alert('Not connect: Verify Network.');
            mensaje = "No se pudo conectae: Verifique la red.";

            // swal("Good job!", "You clicked the button!", "warning")

        } else if (jqXHR.status == 404) {

            // alert('Requested page not found [404]');
            mensaje = "Página solicitada no encontrada [404]"

        } else if (jqXHR.status == 500) {

            // alert('Error interno del servidor reniec [500].');
            mensaje = "Error interno del servidor reniec [500].";

        } else if (textStatus === 'parsererror') {

            // alert('Requested JSON parse failed.');
            mensaje = "Dni no encontrado";


        } else if (textStatus === 'timeout') {

            // alert('Time out error.');
            mensaje = "Error de tiempo de espera.";

        } else if (textStatus === 'abort') {

            // alert('Ajax request aborted.');
            mensaje = "Solicitud de Ajax abortada";

        } else {

            alert('Uncaught Error: ' + jqXHR.responseText);

        }
        $('#exampleModal').modal('hide');
        swal({
            title: "información!",
            text: mensaje,
            icon: "warning",
            showCancelButton: true,
            closeOnConfirm: false
        });

    });




    ;
}

$(document).ready(() => {
    $("#frmRegistro").validate({
        rules: {
            txtDNI: 'required',
            txtnombreApellidos: 'required',
            txtCorreo: 'required',
            txtTelefono: 'required',
            txtContrasena: 'required'
        },
        messages: {
            txtDNI: 'Ingrese su DNI',
            txtnombreApellidos: 'El campo DNI no esta completo',
            txtCorreo: 'Ingrese su correo',
            txtTelefono: 'Ingrese su telefono',
            txtContrasena: 'Ingrese una contraseña',
        }
    });
});

$(document).on('submit', '#frmRegistro', function(event) {
    event.preventDefault();
    AceptarUsuario();
});

function AceptarUsuario() {
    var datax = $('#frmRegistro').serializeArray();
    $.ajax({
            method: "POST",
            url: 'index.php?page=registro&action=registrarUsuario',
            data: datax
        })
        .done(function(text) {
            if (text.accion == "true") {
                swal({
                    text: 'Usuario registrado correctamente',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#3f51b5',
                    cancelButtonColor: '#ff4081',
                    confirmButtonText: 'Great ',
                    buttons: {
                        confirm: {
                            text: "Aceptar",
                            value: true,
                            visible: true,
                            className: "btn btn-primary",
                            closeModal: true
                        }
                    }
                }).then(function(result) {
                    console.log(result);
                    if (result) {
                        window.location.href = text.link;
                    }
                })
            } else {
                swal({
                    text: 'Usuario ya se encuentra registrado',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3f51b5',
                    cancelButtonColor: '#ff4081',
                    confirmButtonText: 'Great ',
                    buttons: {
                        confirm: {
                            text: "Aceptar",
                            value: true,
                            visible: true,
                            className: "btn btn-primary",
                            closeModal: true
                        }
                    }
                }).then(function(result) {
                    console.log(result);
                    if (result) {
                        window.location.href = text.link;
                    }
                })
            }
        });
}