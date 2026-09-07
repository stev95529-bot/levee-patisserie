<?php
include"conectar.php";

$siga=$_POST['siga'];

if($siga=='guardar'){
        $idencuesta = $_POST['idencuesta'];
        $fecha = $_POST['fecha'];
        $nombres = $_POST['nombres'];
        $correo = $_POST['correo'];

        $mysqli->query("INSERT INTO tabla2 (idencuesta,fecha,nombres,correo) values($idencuesta,'$fecha','$nombres','$correo')");
        //$mysqli->query("INSERT INTO tabla1 (idencuesta,fecha,nombres,correo) values($idencuesta,'$fecha','$nombres','$correo')");
        $siga='listar';

   
}


if($siga=='eliminar'){
    $id=$_POST['id'];
    $mysqli->query("DELETE FROM tabla2 WHERE id=$id");
    $siga='listar';
}

if($siga=='listar'){        
         $sqlx = $mysqli->query("SELECT * FROM tabla2 ORDER BY id DESC");
         if($sqlx->num_rows != 0)
		 { 
            
?>
<table class="records-table">
   
        <tr>
            <th>Nro</th>
            <th>ID Encuesta</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Correo</th>
            <th class="text-center">Acciones</th>
        </tr>
    
   
        <?php
                      $num=0;
                        while($fila = $sqlx->fetch_assoc()){ 
                        $color= ($num % 2==0) ? "#FAF8E2" : "#E9FEF0";
                        $num++;
          ?>
        <tr>
            <td><?php echo($num) ?></td>
            <td class=" id-badge"><?php echo($fila['idencuesta']) ?></td>
            <td><?php echo($fila['nombres']) ?></td>
            <td><?php echo($fila['fecha']) ?></td>
            <td class="text-muted-email"><?php echo($fila['correo']) ?></td>

            <td class="text-center">
                <div class="actions-container">
                    <button type="button" class="action-btn btn-edit" title="Editar">
                        <a href="javascript:editar('<?php  echo($fila['idencuesta']) ?>','<?php  echo($fila['fecha']) ?>','<?php  echo($fila['nombres']) ?>','<?php  echo($fila['correo']) ?>')" style="color: #007bff; margin-right: 15px; text-decoration: none;" title="Editar">   
                            <i class="fa-solid fa-pen-to-square"></i>
                        </a>
                    </button>
                    <button type="button" class="action-btn btn-delete" title="Eliminar">
                        <a href="javascript:eliminar('<?php  echo($fila['id']) ?>','<?php  echo($fila['nombres']) ?>')" style="color: #dc3545; text-decoration: none;" title="Eliminar">    
                            <i class="fa-solid fa-trash-can"></i>
                        </a>
                    </button>
                </div>
            </td>
        </tr>
        <?php
            }
        ?>
        
</table>

<?php
         }
}
?>         