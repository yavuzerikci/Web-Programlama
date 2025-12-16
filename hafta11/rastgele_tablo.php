<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Rastgele Tablo</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    input { width: 80px; padding: 6px; }
    button { padding: 7px 12px; cursor: pointer; }
    table { border-collapse: collapse; margin-top: 20px; }
    td { border: 1px solid #333; padding: 10px; text-align: center; }
  </style>
</head>
<body>

<h2>Satır / Sütun Gir → Rastgele Tablo Oluştur</h2>

<form method="post">
  Satır: <input type="number" name="satir" min="1" max="20" required>
  Sütun: <input type="number" name="sutun" min="1" max="20" required>
  <button type="submit">Tablo Oluştur</button>
</form>

<?php
if (isset($_POST["satir"]) && isset($_POST["sutun"])) {

    $satir = (int)$_POST["satir"];
    $sutun = (int)$_POST["sutun"];

    echo "<table>";

    for ($i = 0; $i < $satir; $i++) {
        echo "<tr>";
        for ($j = 0; $j < $sutun; $j++) {
            echo "<td>" . rand(1, 100) . "</td>";
        }
        echo "</tr>";
    }

    echo "</table>";
}
?>

</body>
</html>
