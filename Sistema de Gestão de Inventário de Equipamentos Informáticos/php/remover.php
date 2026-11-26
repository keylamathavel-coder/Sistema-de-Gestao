<?php
require_once __DIR__ . "/conexao.php";

try {
$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados || empty($dados["id"])) {
    responder(["sucesso" => false, "mensagem" => "Equipamento inválido."], 400);
}

$conexao = (new Conexao())->ligar();
$id = (int) $dados["id"];

$stmt = $conexao->prepare("DELETE FROM Lista_Equipamentos WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    responder(["sucesso" => false, "mensagem" => "Equipamento não encontrado."], 404);
}

responder(["sucesso" => true, "mensagem" => "Equipamento removido com sucesso!"]);

} catch (Throwable $erro) {
error_log($erro->getMessage());
responder(["sucesso" => false, "mensagem" => "Erro ao remover o equipamento."], 500);
}