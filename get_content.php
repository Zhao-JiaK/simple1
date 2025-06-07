<?php
require_once 'db_connect.php';

function getNews() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM news ORDER BY date DESC LIMIT 5");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getRankings() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM rankings ORDER BY score DESC LIMIT 10");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getResources() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM resources ORDER BY upload_date DESC LIMIT 5");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

if(isset($_GET['type'])) {
    $type = $_GET['type'];
    switch($type) {
        case 'news':
            echo json_encode(getNews());
            break;
        case 'rankings':
            echo json_encode(getRankings());
            break;
        case 'resources':
            echo json_encode(getResources());
            break;
    }
}