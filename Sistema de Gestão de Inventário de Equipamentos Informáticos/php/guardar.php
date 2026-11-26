<?php
require_once __DIR__ . "/conexao.php";

try {

 $dados = json_decode(file_get_contents("php://input"), true);

    if (!$dados) {
        responder(["sucesso" => false, "mensagem" => "Não foram recebidos dados válidos." ], 400);
    }

$conexao = (new Conexao())->ligar();

$codigo = $dados["codigo"];
$tipo = $dados["tipo"];
$marca = $dados["marca"];
$modelo = $dados["modelo"];
$serie = $dados["serie"];
$departamento = $dados["departamento"];
$utilizador = $dados["utilizador"] ?? "";
$dataAquisicao = $dados["dataAquisicao"];
$valor = $dados["valor"];
$dataGarantia = !empty($dados["dataGarantia"]) ? $dados["dataGarantia"] : null;
$estado = $dados["estado"];
$dataAbate = !empty($dados["dataAbate"]) ? $dados["dataAbate"] : null;
$observacoes = $dados["observacoes"] ?? "";

$sql = "INSERT INTO Lista_Equipamentos
(codigo, tipo, marca, modelo, serie, departamento, utilizador,
data_aquisicao, valor, data_garantia, estado, data_abate, observacoes)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

$stmt->bind_param("ssssssssdssss", $codigo, $tipo, $marca, $modelo,$serie,$departamento,
$utilizador, $dataAquisicao, $valor, $dataGarantia, $estado, $dataAbate,$observacoes);
$stmt->execute();

responder(["sucesso" => true,
    "mensagem" => "Equipamento guardado com sucesso!",
    "id" => $conexao->insert_id
        ]);

} catch (mysqli_sql_exception $erro) {

if ($erro->getCode() == 1062) {
    $mensagem = (strpos($erro->getMessage(), "serie") !== false)
        ? "Este número de série já está registado."
        : "Este código patrimonial já está registado.";
    responder(["sucesso" => false, "mensagem" => $mensagem], 409);
    }
error_log($erro->getMessage());

responder([
    "sucesso" => false,"mensagem" => "Erro ao guardar o equipamento." ], 500);
} catch (Throwable $erro) {
error_log($erro->getMessage());

responder([
    "sucesso" => false,"mensagem" => "Ocorreu um erro ao processar os dados."], 500);
        }