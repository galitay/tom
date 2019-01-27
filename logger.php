<?php
	$content = trim(file_get_contents("php://input"));
	$decoded = json_decode($content, true);
	
	$action = $decoded["action"]. '               ';
	$action = substr($action, 0, 14);
	$status = $decoded["success"] ? "success" : "fail   ";
	$start = $decoded["start"];
	$end = $decoded["end"];
	$name = $decoded["username"];
	
	$text = $action . ' | ' . $status . ' | ' . $start . ' | ' . $end . ' | ' . $name;
	writeToLog($text);
	
	function writeToLog($text){
		
		$tz = 'Asia/Jerusalem';
		$timestamp = time();
		$dt = new DateTime("now", new DateTimeZone($tz)); //first argument "must" be a string
		$dt->setTimestamp($timestamp); //adjust the object to correct timestamp
		// echo $dt->format("Y-m-d H:i:s");

    	$currentContent = "";
    	$fullPath = $_SERVER['DOCUMENT_ROOT'] . "/tom/tom.log"; 
    	if (file_exists($fullPath)){
    		$currentContent = file_get_contents($fullPath) . PHP_EOL;
    	}
    	$currentTime = $dt->format("Y-m-d H:i:s");
    	$userIp = $_SERVER['REMOTE_ADDR'] . '               ';
    	// $userIp = substr($userIp, 0, 15);
    	$text = $currentTime . ' | ' .  $text;
    	file_put_contents($fullPath, $currentContent . $text);
    }
	
?>