 function guardar(){

	    if(confirm('Confirme Guardar Registro ?')){
satisfaccion
             idencuesta=document.getElementById('crudidencuesta').value;
             fecha=document.getElementById('crudfecha').value;
             nombres=document.getElementById('crudnombre').value;
             correo=document.getElementById('crudcorreo').value;
          
             $("#crudlistar").load("registros.php",{idencuesta:idencuesta,fecha:fecha,nombres:nombres,correo:correo,siga:'guardar'},function(){
                document.getElementById('crudidencuesta').value='';
                document.getElementById('crudfecha').value='';
                document.getElementById('crudnombre').value='';
                document.getElementById('crudcorreo').value='';
                document.getElementById('crudidencuesta').focus();
             });
           
        }
 }

function listar() {
    $("#crudlistar").load("registros.php",{siga:'listar'},function(){});
}

function eliminar(id,nombres) {
    if(confirm('Confirme Eliminar Registro : '+nombres+' ?')){
        //alert(id+' - '+nombres);
        $("#crudlistar").load("registros.php",{siga:'eliminar',id:id},function(){});
    }
}

function limpiar() {
    document.getElementById('crudidencuesta').value='';
    document.getElementById('crudfecha').value='';
    document.getElementById('crudnombre').value='';
    document.getElementById('crudcorreo').value='';
    document.getElementById('crudidencuesta').focus();
}

function editar(idencuesta,fecha,nombres,correo) {
    document.getElementById('crudidencuesta').value=idencuesta;
    document.getElementById('crudfecha').value=fecha;
    document.getElementById('crudnombre').value=nombres;
    document.getElementById('crudcorreo').value=correo;
    document.getElementById('crudidencuesta').focus();

}

