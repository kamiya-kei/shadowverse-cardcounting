<?php

$url = $_POST['url'];
$source = file_get_contents($url);
echo $source;

?>