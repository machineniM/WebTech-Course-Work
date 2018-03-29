<!DOCTYPE HTML>  
<html>
<head>
 <meta charset="UTF-8">
<style>
.error {color: #FF0000;}

h2{
font-style: oblique;
font-weight:normal;
padding:0px 250px;
font-family: Arial, Helvetica, sans-serif ;
}

#hw6div1{
margin:0px 300px;
width: 700px;
height: 188px;
background:#E0E0E0 ;
font-family: Arial, Helvetica, sans-serif ;
}

#hw6div2{
margin:0px 300px;
width: 700px;
font-family: Arial, Helvetica, sans-serif ;
}

#hw6div3 p{
text-align: center;
font-family: Arial, Helvetica, sans-serif ;
background:#E0E0E0 ;
}

#hw6norec{
text-align: center;
font-family: Arial, Helvetica, sans-serif ;
background:#E0E0E0 ;	
}

#hw6div3 table{
display:none;	
}

body{
width: 700px;	
}

#hw6div2 table{
border-color:black;
border-spacing:0.2px;
}

form{
padding:0px 9px;	
	
}

</style>
</head>
<script type="text/javascript">
function hideShowHw6Table(type){
   typeValue=document.getElementById('typeId').value;
   if(typeValue=='places'){
   document.getElementById('hw6table1').style.visibility = "visible";
   if(type=='type'){
   document.getElementById('locationId').value='';
   document.getElementById('distanceId').value='';
   }
   }
   else {
   document.getElementById('hw6table1').style.visibility = "hidden";
   }
}

function onClear(){
  window.location.href="searchhw6.php";
}

function setLocDis(){
typeValue=document.getElementById('typeId').value;
   if(typeValue!='places'){
document.getElementById('locationId').value="empty";
document.getElementById('distanceId').value="empty";
   }
}


function hideTable(){
document.getElementById('ResultTableId').style.display="none";
document.getElementById('hw6div3').style.display="block";	
}

function hidePostsTable(){
if(document.getElementById('postsid').style.display=="block"){
document.getElementById('postsid').style.display="none";
}
else{
document.getElementById('postsid').style.display="block";	
}
document.getElementById('albumsid').style.display="none";	
}

function hideAlbumsTable(){
if(document.getElementById('albumsid').style.display=="block"){
document.getElementById('albumsid').style.display="none";	
}
else{
document.getElementById('albumsid').style.display="block";	
}
document.getElementById('postsid').style.display="none";
}

function showHideElement(id){
displayValue=document.getElementById(id).style.display;
if("block"==displayValue){
document.getElementById(id).style.display="none";
}
else{
document.getElementById(id).style.display="block";
}	
}

function alertCallLoc()
{
	alert("GeoLocation is not Valid, Please provide a valid location. Displaying Search results based on the keyword given");
}

function alertCallLocDist()
{
	alert("Please provide input for Location. Search cannot be performed on Distance with out Location. Displaying Search results based on the keyword given.");
}
</script>
<body>  

<?php
date_default_timezone_set('UTC');
require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';
$keyword = $type = $location=$distance="";	
?>

<div id="hw6div1">
<h2>Facebook Search</h2>
<form method="get" id="formSearch" action="searchhw6.php">  
<hr>
<table>
  <tr><td>Keyword: </td><td><input type="text" id="keywordid" name="keyword" value="<?php if(isset($_GET['submit'])||isset($_GET['details'])){echo $_GET['keyword'];} else{echo $keyword;}?>" required oninvalid="setCustomValidity('This cant be left empty')"
    oninput="setCustomValidity('')"></td></tr>
  <tr><td>Type: </td><td><select name="type" id="typeId" onchange="hideShowHw6Table('type')">
  <option value="users" <?php if(((isset($_GET['submit'])|| isset($_GET['details']))  && $_GET['type']=='users')|| !isset($_GET['submit'])):?>selected<?php endif;?> >Users</option>
  <option value="pages" <?php if((isset($_GET['submit'])||isset($_GET['details'])) && $_GET['type']=='pages'):?>selected<?php endif;?> >Pages</option>
  <option value="events" <?php if((isset($_GET['submit']) || isset($_GET['details'])) && $_GET['type']=='events'):?>selected<?php endif;?> >Events</option>
  <option value="places" <?php if((isset($_GET['submit'])||isset($_GET['details'])) && $_GET['type']=='places'):?>selected<?php endif;?>>Places</option>
  <option value="groups" <?php if((isset($_GET['submit'])|| isset($_GET['details'])) && $_GET['type']=='groups'):?>selected<?php endif;?>>Groups</option>
</select></td></tr>
 </table>
  <table id="hw6table1" style="visibility:<?php if(isset($_GET['type']) &&$_GET['type']=='places'){echo 'visible';} else {echo 'hidden';}?>">
  <tr>
  <td>Location: </td><td><input type="text" id="locationId" name="location" value="<?php if((isset($_GET['submit']) || isset($_GET['details'])) && $_GET['type']=='places'){echo $_GET['location'];} else{echo $location;}?>" ></td>
 <td> Distance(meters): </td><td><input type="text" id="distanceId" name="distance" value="<?php if((isset($_GET['submit']) || isset($_GET['details'])) && $_GET['type']=='places'){echo $_GET['distance'];} else { echo $distance;}?>" ></td>
  </table>
  <table>
  <tr>
  <td><pre>         </pre></td>
  <td><input type="submit" name="submit" value="Search" onclick="hideShowHw6Table('submit')"></td>  
  <td><input type="reset" name="reset" value="Clear" onclick="onClear()"></td>
  </tr>
  </table>
  </form>
</div>
<div id="hw6div2">
<?php
$fb = new Facebook\Facebook([
  'app_id' => 109543999539135,
  'app_secret' => 'acbf4bb5a1dcbf0562fcfc0a15323170',
  'default_access_token' => 'EAABjoTMuB78BALRaZAgRf77zG1HBf9cyoMA7z4amCRLZAWWJls3sZCN07l1Ldl2qgD8ptY5ZAIWV4eZAGQwTsFTyyrQpcSXScD0XhpEtBS4vP2A2dsMagqfoaPqlFFsfRw6BNNHUbhcxNDBnFoZAlNGCcMf7ExXkkZD',
  'default_graph_version' => 'v2.8',
   ]);

if(isset($_GET['submit'])):
$length=strlen($_GET['type']);
$typetosearch=substr($_GET['type'],0,$length-1);
if($typetosearch=='place'){
if(strlen(trim($_GET['location']))!=0){
$address=str_replace(" ","+",$_GET['location']);
$urlGeoLocation='https://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&key=AIzaSyBkvgcdSq_cFO61qVYlaB61SArhukTIxJI';	
$outputGeoLoc=file_get_contents($urlGeoLocation);	
$jsonout=json_decode($outputGeoLoc,true);
if($jsonout['status']=='OK'){
$resultsJson=$jsonout['results'][0];
$jsonString=json_encode($resultsJson);
$parsedJson=json_decode($jsonString,true);
if(array_key_exists('geometry',$parsedJson)){
$locationValues=$parsedJson['geometry']['location'];
$lat=$locationValues['lat'];
$lon=$locationValues['lng'];
$urlReq='/search?q='.$_GET['keyword'].'&type='.$typetosearch.'&center='.$lat.','.$lon.'&distance='.$_GET['distance'].'&fields= id,name,picture.width(700).height(700)';
}
}
else{
echo '<script type="text/javascript">alertCallLoc()</script>'; 
$urlReq='/search?q='.$_GET['keyword'].'&type='.$typetosearch.'&fields= id,name,picture.width(700).height(700)';
}
}
else if(strlen(trim($_GET['location']))==0 && strlen(trim($_GET['distance']))!==0){
echo '<script type="text/javascript">alertCallLocDist()</script>'; 
$urlReq='/search?q='.$_GET['keyword'].'&type='.$typetosearch.'&fields= id,name,picture.width(700).height(700)';
}
else{
$urlReq='/search?q='.$_GET['keyword'].'&type='.$typetosearch.'&fields= id,name,picture.width(700).height(700)';
}
}
else if($typetosearch=='event'){
$urlReq= '/search?q='.$_GET['keyword'].'&type='.$typetosearch.'&fields= id,name,picture.width(700).height(700),place';	
}
else{
$urlReq= '/search?q='.$_GET['keyword'].'&type='.$typetosearch.'&fields= id,name,picture.width(700).height(700)';
}

   try{
  $response =$fb->get($urlReq);
  }
  catch(Facebook\Exceptions\FacebookResponseException $e)
  {
  echo 'Message: ' . $e->getMessage();
  $previousException = $e->getPrevious();
  exit;	  
  }
  $graphEdges=$response->getGraphEdge();
  if(0!=sizeof($graphEdges)):
?>
<br>
 <table id="ResultTableId" border=1 width=100%>
 <tr><th>Profile Photo</th>
 <th>Name</th>
<?php if($typetosearch=='event'):?>
<th>Place</th>
<?php else:?>
 <th>Details</th></tr>
<?php endif;
foreach ($graphEdges as $x):    $x->asArray();
?>
<tr><td><a href="<?php echo $x['picture']['url'];?>" target ="_blank"><img src=<?php echo $x['picture']['url'];?> width="30px" height="40px"/></a></td>
<td><?php echo $x['name'];?></td>
<?php if($typetosearch=='event'):?>
<td><?php if($x->getProperty('place')!=NULL): echo $x['place']['name']; else : echo 'UnKnown'; endif;?> </td>
<?php else:?>
<td><a id=<?php echo $x['id']?> href="searchhw6.php?keyword=<?php echo $_GET['keyword']?>&type=<?php echo $_GET['type']?>&location=<?php echo $_GET['location']?>&distance=<?php echo $_GET['distance']?>&details=true&detailsId=<?php echo $x['id']?>" >Details</a>
 </td>
 <?php endif; ?>
 </tr>	
<?php endforeach; ?>
</table>
<?php 
else:?>
<p id="hw6norec">No Records have been found</p>
<?php endif;
endif; ?>
<div id="hw6div3">
<?php 
if(isset($_GET['details'])):
$detId=$_GET['detailsId'];
$urlDetails='/'.$detId.'? fields=id,name,picture.width(700).height(700),albums.limit(5){name,photos.limit(2){name, picture}},posts.limit(5)';
$detailsResponse =$fb->get($urlDetails);
$graphObjectDetails=$detailsResponse->getGraphNode();
if($graphObjectDetails->getField('albums')==NULL):?>
<p>No Albums have been found</p>
<?php 
else:
$graphAlbums=$graphObjectDetails->getField('albums');?>
<p><a href="#" onclick="hideAlbumsTable()">Albums</a></p>
<table id="albumsid" border>
<?php foreach($graphAlbums as $albumitem):?>
<?php if($albumitem->getField('photos')!=NULL): ?>
<tr><td style="width:700px"><a href="#/<?php echo str_replace(" ","_",$albumitem['name']);?>" onclick="showHideElement('<?php echo str_replace(" ","_",$albumitem['name']);?>')"><?php echo $albumitem['name']; ?></a></td></tr>
<tr id="<?php echo str_replace(" ","_",$albumitem['name']); ?>"  style="display:none">
<?php foreach($albumitem->getField('photos') as $photoItem):
$albumPhotoUrl='/'.$photoItem['id'].'/picture';
$albumImgResponse=$fb->get($albumPhotoUrl);
$hrefAlbum=$albumImgResponse->getHeaders();
$hrefAlbumUrl=$hrefAlbum['Location'];
?>
<td><a href="<?php echo $hrefAlbumUrl;?>" target ="_blank"><img src="<?php echo $photoItem['picture'];?>" width="80px" height="80px"/></a></td>
<?php endforeach;?>
</tr>
<?php else: ?>
<tr><td style="width:700px"><?php echo $albumitem['name'];?></td></tr>
<?php endif; endforeach; ?>
</table>
<?php endif;
if($graphObjectDetails->getField('posts')==NULL):?>
<p>No Posts have been found</p>
<?php 
else:?>
<p><a href="#/postsid" onclick="hidePostsTable()">Posts</a></p>
<?php 
$postsDetails=$graphObjectDetails->getField('posts');	?>
<table id="postsid" border=1>
<tr><th style="width:700px">Messages</th></tr>
<?php foreach($postsDetails as $postMess): 
if($postMess->getProperty('message')!=null):
?>
<tr><td style="width:700px"><?php echo $postMess['message']; endif;?></td>
<?php endforeach;?>
</table>
<?php 
endif;
echo '<script type="text/javascript">hideTable()</script>';
endif;
?>

</div>
</div>
</body>
</html>
