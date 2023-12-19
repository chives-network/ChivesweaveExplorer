<?
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header("Content-type: text/html; charset=utf-8");
require_once('include.inc.php');

$get_blockchain_state 	= 得到网络基本信息CACHE();
$difficulty 			= $get_blockchain_state['difficulty'];
$height 				= $get_blockchain_state['peak']['height'];
$space 					= number_format($get_blockchain_state['space']/(1024*1024*1024*1024*1024), 2, '.', '');

$RS 		= [];
$日期列表 	= array();
$数量列表 	= array();
for($i=60;$i>=0;$i--)				{
	$DATE 					   = date("Ymd",mktime(1,1,1,date('m'),date('d')-$i,date('Y')));
	$空间算力				    = $redis->hGet("CHIVES_STAT_NETWORK_SPACE",$DATE);
	if($空间算力>0)		{
		$日期列表[] 			= $DATE;
		$数量列表[] 			= intval($空间算力*100/1024)/100;
	}
}
$RS['NETWORK_SPACE']['dataX'] = $日期列表;
$RS['NETWORK_SPACE']['dataY'] = $数量列表;


$日期列表 = array();
$数量列表 = array();
for($i=60;$i>=0;$i--)				{
	$DATE 					   = date("Ymd",mktime(1,1,1,date('m'),date('d')-$i,date('Y')));
	$空间算力					= $redis->hGet("CHIVES_STAT_DIFFICULTY",$DATE);
	if($空间算力>0)		{
		$日期列表[] 			= $DATE;
		$数量列表[] 			= (INT)$空间算力;
	}
}
$RS['DIFFICULTY']['dataX'] = $日期列表;
$RS['DIFFICULTY']['dataY'] = $数量列表;


$日期列表 = array();
$数量列表 = array();
for($i=60;$i>=0;$i--)				{
	$DATE 				= date("Ymd",mktime(1,1,1,date('m'),date('d')-$i,date('Y')));
	$空间算力				= $redis->hGet("CHIVES_STAT_ACTIVEMINERS",$DATE);
	$日期列表[] 			= $DATE;
	$数量列表[] 			= $空间算力;
}
$RS['ACTIVEMINERS']['dataX'] = $日期列表;
$RS['ACTIVEMINERS']['dataY'] = $数量列表;

$日期列表 = array();
$数量列表 = array();
$每天交易数量ALL			= $redis->hGetAll("CHIVES_STAT_EVERY_DAY_TX_NUMBER");
for($i=360;$i>=0;$i--)				{
	$DATE 				= date("Y-m-d",mktime(1,1,1,date('m'),date('d')-$i,date('Y')));
	$每天交易数量			= $每天交易数量ALL[$DATE];
	if($每天交易数量>0&&$DATE!=date("Y-m-d"))		{
	$日期列表[] 			= $DATE;
	$数量列表[] 			= $每天交易数量;
	}
}
$RS['EVERY_DAY_TX_NUMBER']['dataX'] = $日期列表;
$RS['EVERY_DAY_TX_NUMBER']['dataY'] = $数量列表;

print_R(json_encode($RS));

?>