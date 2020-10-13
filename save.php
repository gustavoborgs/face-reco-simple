<?php

if(isset($_POST['ghumor'])) {
    //save the info
    $humor = $_POST['ghumor'];
    echo $humor->happy;
    //inseri no banco
}

?>