<?php
require_once __DIR__ . "/conexao.php";

try{
    $conexao = (new Conexao())-> ligar();

    $resultado = $conexao->query(
        "SELECT id, codigo, tipo, marca, modelo, serie, departamento, utilizador,
        data_aquisicao, valor, data_garantia, estado, data_abate,
        observacoes, criado_em from Lista_Equipamentos ORDER BY id DESC"
    );
    responder(["sucesso"=> true, "equipamentos" => $resultado->fetch_all(MYSQLI_ASSOC)]);
}catch(Throwable $erro){
error_log($erro->getMessage());
responder(["sucesso"=> false, "mensagem"=> "Erro ao listar."], 500);
}