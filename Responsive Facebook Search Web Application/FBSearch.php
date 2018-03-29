<?php
    header("Content-Type: application/json");
    require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';
    $facebookobj = new Facebook\Facebook([
    'app_id' => 109543999539135,
    'app_secret' => 'acbf4bb5a1dcbf0562fcfc0a15323170',
    'default_access_token' => 'EAABjoTMuB78BALRaZAgRf77zG1HBf9cyoMA7z4amCRLZAWWJls3sZCN07l1Ldl2qgD8ptY5ZAIWV4eZAGQwTsFTyyrQpcSXScD0XhpEtBS4vP2A2dsMagqfoaPqlFFsfRw6BNNHUbhcxNDBnFoZAlNGCcMf7ExXkkZD',
    'default_graph_version' => 'v2.8',
     ]);
/*Getting the Data Variables*/
$nextPreviousIdentifier=$_GET["nextPreviousIdentifier"];
$typeSelected=$_GET["searchtype"];
$isCallForDetails=$_GET["isCallForDetails"];


if(null!=$isCallForDetails) 
	{
/*Call to get the Album photos*/

	if("false" == $isCallForDetails){
	$pictureArray=$_GET["picIdsArray"];
	$pictureUrlResponse=array();
	$rowCount=count($pictureArray);
	for($i=0;$i<$rowCount;$i++){
		$pictureUrlResponse[$i]=array();
	for($j=0;$j<2;$j++){
		$picture=null!=$pictureArray[$i][$j]?$pictureArray[$i][$j]:null;
		 if($picture!=null)
		{
		$albumPhotoUrl='/'.$picture.'/picture';
		$pictureResponse=$facebookobj->get($albumPhotoUrl);
		$pictureResponse1=$pictureResponse->getHeaders();
		$pictureUrlResponse[$i][$j]=$pictureResponse1['Location'];		
		}
	}				
	}
	echo json_encode($pictureUrlResponse);
	}
	/*Call to get Details*/
	else{
	$profileId=$_GET["profileId"];
	if('event'==$typeSelected){
	$detailsIdUrl=  $profileId."?fields=id,name,picture.width(700).height(700)&format=json";
	}
	else{
	$detailsIdUrl = $profileId."?fields=id,name,picture.width(700).height(700),albums.limit(5){name,photos.limit(2){name, picture}},posts.limit(5){message,story,created_time}&format=json";
    }
	$detailsResponse = $facebookobj->get($detailsIdUrl);
    $detailsDecodedResponse = $detailsResponse->getDecodedBody();
    echo json_encode($detailsDecodedResponse);
	}
	}


else 
{   /*Call to get the Search & Type based Records*/
	if(null==$nextPreviousIdentifier){
	$searchKeyWord=$_GET["keyword"];
	if( "place"!=$typeSelected){
    $fbSearchQuery='/search?q='.$searchKeyWord.'&type='.$typeSelected.'&fields=id,name,picture.width(700).height(700)';
	}
    else
    {
        $geoLatitude=$_GET["geoLatitude"];
        $geoLongitude=$_GET["geoLongitude"];
        $fbSearchQuery='/search?q='.$searchKeyWord.'&type='.$typeSelected.'&center='.$geoLatitude.','.$geoLongitude.'&fields=id,name,picture.width(700).height(700)';

    }
 }
/*Call to get Next & Previous for Search & Type based Records*/
else
{    
	$facebookUrlIndex= strpos($nextPreviousIdentifier,"/search");
    $fbSearchQuery = substr($nextPreviousIdentifier, $facebookUrlIndex, strlen($nextPreviousIdentifier));
}
   if(null!=$fbSearchQuery && ""!=$fbSearchQuery)
        {
            try
            {   
                $facebookResponse=$facebookobj->get($fbSearchQuery);
            }
            catch(Facebook\Exceptions\FacebookResponseException $e)
			{
			echo 'Exception Message: ' . $e->getMessage();
			exit;	  
			}
        }
    $decodedResponse=$facebookResponse->getDecodedBody();
    echo json_encode($decodedResponse);
}
?>