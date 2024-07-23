<?php
    $file = file_get_contents('users.json');
    $Jarray = json_decode($file);

    $uname = $_POST['username'];
    $pass = $_POST['password'];
    // echo $Jarray[0];

    $jsonDecoded = [
        "uname" => "$uname",
        "pass" => "$pass"
    ];

    array_push($Jarray, $jsonDecoded);
    
    $jsonEncoded = json_encode($Jarray);
    // echo $jsonDecoded['users'][0]["uname"];
    // echo "<br>";

    file_put_contents('users.json', $jsonEncoded);

    echo "
        <a href='http://localhost:9000/user=$uname'><button>LOGIN</button></a>
    ";
?>