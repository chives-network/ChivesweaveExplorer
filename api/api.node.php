<?
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header("Content-type: text/html; charset=utf-8");
require_once('include.inc.php');

$CHIVES_NODES_PEERINFO		= $redis->hGetAll('CHIVES_NODES_PEERINFO');
$KEYS						= array_keys($CHIVES_NODES_PEERINFO);
$总结点数					= COUNT($KEYS);

for($i=0;$i<sizeof($KEYS);$i++)		{
	$KEY 	= $KEYS[$i];
	$VALUE	= unserialize($CHIVES_NODES_PEERINFO[$KEY]);
	$总国家数量[(STRING)$VALUE['country']] 		= $VALUE['country'];
	$最多使用国家[(STRING)$VALUE['country']] 	+= 1;
	//print_R($VALUE);
}

arsort($最多使用国家); 	$VALUES = array_keys($最多使用国家); 	$最多使用国家X = $VALUES[0];
$总国家数量				= COUNT(array_keys($总国家数量));

$VALUES 				= array_values($最多使用国家);
$最多使用国家的结点数量 = $VALUES[0];
//print_R($VALUE);print_R($总国家数量);print_R($最多使用协议);print_R($最多使用版本);print_R($最多使用国家);


$get_blockchain_state 	= 得到网络基本信息CACHE();

//print_R($get_blockchain_state);

$difficulty 			= $get_blockchain_state['difficulty'];
$synced 				= $get_blockchain_state['sync']['synced'];
if($synced)		{
	$synced = "Synced";
}
else		{
	$synced = "Not Synced";	
}
$height 				= $get_blockchain_state['peak']['height'];
$mempool_size 			= $get_blockchain_state['mempool_size'];
$space 					= number_format($get_blockchain_state['space']/(1024*1024*1024*1024*1024), 2, '.', '');


$LANG_ARRAY['en']['农民'] 				= "Farmer";
$LANG_ARRAY['en']['农民'] 				= "Farmer";
$LANG_ARRAY['en']['农民'] 				= "Farmer";
$LANG_ARRAY['en']['农民'] 				= "Farmer";
$LANG_ARRAY['en']['农民'] 				= "Farmer";
$LANG_ARRAY['en']['农民'] 				= "Farmer";
$LANG_ARRAY['en']['农民'] 				= "Farmer";

$RS = [];
$RS['NetworkSpace']['value'] = $space;
$RS['NetworkSpace']['badge'] = "Pb";
$RS['BlockHeight']['value'] = $height;
$RS['BlockHeight']['badge'] = $synced;
$RS['AssetTokenNumber']['value'] = $get_blockchain_state['AssetTokenNumber'];
$RS['Farmers']['value'] 	= $redis->hget("CHIVES_NETWORK_STATUS","AllMiners");
$RS['Addresses']['value'] 	= $redis->hget("CHIVES_NETWORK_STATUS","AllAddress");
$RS['Node']['MostActive'] 	= $最多使用国家X;
$RS['Node']['value'] 		= $最多使用国家的结点数量;


print_R(json_encode($RS));

?>