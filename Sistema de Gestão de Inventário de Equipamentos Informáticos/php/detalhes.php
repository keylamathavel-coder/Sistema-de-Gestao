<?php
// Devolve todos os dados de UM equipamento (usado pela página Detalhes.html)
// Chamada: php/detalhes.php?id=5
require_once __DIR__ . "/conexao.php";

try {
    // O id vem no endereço (GET); (int) garante que é um número
    $id = (int) ($_GET["id"] ?? 0);

    if ($id <= 0) {
        responder(["sucesso" => false, "mensagem" => "Equipamento inválido."], 400);
    }

    $conexao = (new Conexao())->ligar();

    // Procura o equipamento pelo id (consulta preparada: protege contra SQL injection)
    $stmt = $conexao->prepare(
        "SELECT id, codigo, tipo, marca, modelo, serie, departamento, utilizador,
        data_aquisicao, valor, data_garantia, estado, data_abate,
        observacoes, criado_em FROM Lista_Equipamentos WHERE id = ?"
    );
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $equipamento = $stmt->get_result()->fetch_assoc();

    if (!$equipamento) {
        responder(["sucesso" => false, "mensagem" => "Equipamento não encontrado."], 404);
    }

    responder(["sucesso" => true, "equipamento" => $equipamento]);

} catch (Throwable $erro) {
    error_log($erro->getMessage());
    responder(["sucesso" => false, "mensagem" => "Erro ao obter os detalhes."], 500);
}