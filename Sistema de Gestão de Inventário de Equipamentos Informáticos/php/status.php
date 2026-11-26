<?php
require_once __DIR__ . "/conexao.php";
try {
    $conexao = (new Conexao())->ligar();
    responder([
        "sucesso" => true,
        "mensagem" => "Ligação à base de dados estabelecida com sucesso!"
    ]);

} catch (Throwable $erro) {
    error_log($erro->getMessage());

  responder([
    "sucesso" => false,
    "mensagem" => "Erro na ligação à base de dados.",
    "detalhe" => $erro->getMessage()
], 500);
}