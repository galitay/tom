<?php
define( 'ROOT_DIR_M', dirname(__FILE__) );
require_once(ROOT_DIR_M.'/../class/constants.php');
require_once(ROOT_DIR_M.'/../class/db.php');

	$userId = $_POST["userId"];
	$userId = "itay.gal@toluna.com";
	
	$sql = "SELECT listName,emails,selected FROM mailingLists WHERE userId=? ORDER BY listName"; 
	$params = array();
	$params = [$userId];
	$types = "s";
	$db = new db();
	$stmt = $db->querySafe($sql, $types, $params);
	$stmt->bind_result($listName, $emails, $selected);
	$data = array();
	while ($stmt->fetch()) {
		$mList = new stdClass;
		$mList->listName = $listName;
		$mList->emails = $emails;
		$mList->selected = $selected;
		$data[]=$mList;
	}
	echo json_encode($data);
?>