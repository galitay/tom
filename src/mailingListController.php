<?php
define( 'ROOT_DIR_M', dirname(__FILE__) );
require_once(ROOT_DIR_M.'/../class/constants.php');
require_once(ROOT_DIR_M.'/../class/db.php');

	$data = json_decode(file_get_contents('php://input'), true);
	$action = $data["action"];
	$db = new db();
	if ($action == "GET"){
		$params = array();
		$params = [$data["userId"]];
		$types = "s";
		$sql = "SELECT id,listName,emails,selected FROM mailingLists WHERE userId=? ORDER BY listName"; 
		$stmt = $db->querySafe($sql, $types, $params);
		$stmt->bind_result($id,$listName, $emails, $selected);
		$dbdata = array();
		while ($stmt->fetch()) {
			$mList = new stdClass;
			$mList->id = $id;
			$mList->listName = $listName;
			$mList->emails = $emails;
			$mList->selected = $selected;
			$dbdata[]=$mList;
		}
		echo json_encode($dbdata);
	}

	if ($action == "INSERT"){
		$userId = $data["userId"]; 
		$listName = $data["listName"]; 
		$emails = $data["emails"];
		$sql = "INSERT INTO mailingLists VALUES(NULL,?,?,?,0)"; 
		$params = array();
		$params = [$userId, $listName, $emails];
		$types = "sss";
		$stmt = $db->querySafe($sql, $types, $params);
	}

    if ($action == "DELETE"){
		$userId = $data["userId"];
		$listName = $data["listName"];
		$sql = "DELETE FROM mailingLists WHERE userId=? AND listName=?"; 
		$params = array();
		$params = [$userId, $listName];
		$types = "ss";
		$stmt = $db->querySafe($sql, $types, $params);
	}

	if ($action == "UPDATE"){
		$userId = $data["userId"];
		$listName = $data["listName"];
		$emails = $data["emails"];
		$selected = $data["selected"];
		$sql = "UPDATE mailingLists SET listName=?,emails=?,selected=? WHERE userId=? AND listName=?"; 
		$params = array();
		$params = [$listName,$emails, $selected, $userId, $listName];
		$types = "ssiss";
		$stmt = $db->querySafe($sql, $types, $params);
	}
?>