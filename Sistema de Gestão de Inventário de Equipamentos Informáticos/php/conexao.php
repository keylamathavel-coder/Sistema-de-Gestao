<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

class Conexao {
    private ?mysqli $ligacao = null;
public function ligar(): mysqli {
if ($this->ligacao === null) {
$this->ligacao = new mysqli("localhost","root","1234","Sistema_de_Gestãoo");
            $this->ligacao->set_charset("utf8mb4");
        }
        return $this->ligacao;
    }
}
function responder(array $conteudo, int $codigo = 200): void {
    http_response_code($codigo);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($conteudo, JSON_UNESCAPED_UNICODE);
    exit;
}