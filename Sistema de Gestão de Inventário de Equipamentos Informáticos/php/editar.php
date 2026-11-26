<?php
require_once __DIR__ . "/conexao.php";

try {
    $dados = json_decode(file_get_contents("php://input"), true);

    if (!$dados || empty($dados["id"])) {
        responder(["sucesso" => false, "mensagem" => "Equipamento inválido."], 400);
    }

$conexao = (new Conexao())->ligar();

$id = (int) $dados["id"];
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

$sql = "UPDATE Lista_Equipamentos SET codigo = ?, tipo = ?, marca = ?, modelo = ?, serie = ?, departamento = ?,
utilizador = ?, data_aquisicao = ?, valor = ?, data_garantia = ?,
estado = ?, data_abate = ?, observacoes = ? WHERE id = ?";

$stmt = $conexao->prepare($sql);
$stmt->bind_param("ssssssssdssssi", $codigo, $tipo, $marca, $modelo, $serie, $departamento,
    $utilizador, $dataAquisicao, $valor, $dataGarantia, $estado, $dataAbate, $observacoes, $id);
$stmt->execute();

responder(["sucesso" => true, "mensagem" => "Equipamento atualizado com sucesso!"]);

} catch (mysqli_sql_exception $erro) {
if ($erro->getCode() == 1062) {
    $mensagem = (strpos($erro->getMessage(), "serie") !== false)
        ? "Este número de série já está registado."
        : "Este código patrimonial já está registado.";
    responder(["sucesso" => false, "mensagem" => $mensagem], 409);
    }
error_log($erro->getMessage());
responder(["sucesso" => false, "mensagem" => "Erro ao atualizar o equipamento."], 500);
} catch (Throwable $erro) {
error_log($erro->getMessage());
responder(["sucesso" => false, "mensagem" => "Ocorreu um erro ao processar os dados."], 500);
        }