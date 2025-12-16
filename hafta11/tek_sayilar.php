<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Tek Sayılar</title>
</head>
<body>

<h2>1 - 100 Arası Tek Sayılar</h2>

<?php
for ($i = 1; $i <= 100; $i++) {
    if ($i % 2 != 0) {
        echo $i . "<br>";
    }
}
?>

</body>
</html>
