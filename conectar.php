<?php

	/*error_reporting (5);*/

  $dbhost = "localhost";
  $dbusuario = "root";
  $dbpass = "";
  $dbnombre = "basecrud";

$mysqli = new mysqli($dbhost, $dbusuario, $dbpass, $dbnombre);
if ($mysqli->connect_errno) {
    echo "Fallo al contenctar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
?>
