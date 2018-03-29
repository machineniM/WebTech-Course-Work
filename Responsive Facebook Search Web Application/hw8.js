   
        /*
         Declaring searchKeyWord, profileype, geoLat, geoLong, FavDataVar that stores fav item selected
         */
        var searchKeyWord = " ";
        var profileType = " ";
        var geoLat = " ";
        var geoLong = " ";
        var FavDataVar;

        $(window).on("load", function () {
            geoLat = localStorage.getItem("geoLatitude");
            geoLong = localStorage.getItem("geoLongitude");
            if (!(" " != geoLat && " " != geoLong && null != geoLat && null != geoLong)) {
                window.addEventListener("load", getLocation());
            }
        });


        var localKeyStorageArray = new Array();
        $(window).on("load", localKeyStorageArrayLoad());

        function localKeyStorageArrayLoad() {
            var length = localStorage.length;
            var i = 0;
            for (; i < length; )
            {
                var Items = JSON.parse(localStorage.getItem(localStorage.key(i)));
                localKeyStorageArray.push(Items["rowid"]);
                i++;
            }

        }
        $(function () {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: '109543999539135',
                    xfbml: true,
                    status: true,
                    version: 'v2.8'
                });
            };

            (function (facebookObj, tagName, elementId) {
                var tagScr, fbtagScr = facebookObj.getElementsByTagName(tagName)[0];
                if (facebookObj.getElementById(elementId))
                {
                    return;
                }
                tagScr = facebookObj.createElement(tagName);
                tagScr.id = elementId;
                tagScr.src = "https://connect.facebook.net/en_US/sdk.js";
                fbtagScr.parentNode.insertBefore(tagScr, fbtagScr);
            }
            (document, 'script', 'facebook-jssdk'));
            /*
             search Icon Click Event
             */

            $('#searchIconId').click(function (event) {
                var tabId = $("#Navtabs ul.nav.navbar-nav li.active")[0].id;
                var index = tabId.search("_");
                var profileType = tabId.substr(index + 1, tabId.length);
                event.preventDefault();
                searchKeyWord = ($("#searchKeyWord").val()).trim();
                var searchKeyWordLength = searchKeyWord.length;
                /*if (searchKeyWordLength == 0) {
                    $("#searchKeyWord").attr('title', 'Please Enter the Search Key');
                    $("#searchKeyWord").attr('data-placement', "bottom");
                    $('[data-toggle="tooltip"]').tooltip();
                } else {
                    $("#searchKeyWord").data('title', $("#searchKeyWord").attr('title'));
                    $("#searchKeyWord").removeAttr('title');
					$("#searchKeyWord").attr('title', '');
					$('[data-toggle="tooltip"]').tooltip("disable");
                }*/

                if ("favourites" == profileType)
                {

                    getLocalStorageData();
                } 
				else if(searchKeyWordLength>0){
                    hiddenProgress();
                    var responseObj = callingAjaxFn(searchKeyWord, profileType, null, geoLat, geoLong, null);
                    console.log(responseObj);
                    displaySearchResultsTable(responseObj, profileType, true);
                }
            })

            /*
             Previous Button click
             */

            $('#prevButton').click(function (event) {
                event.preventDefault();
                var responseObj = callingAjaxFn(searchKeyWord, profileType, previous, null, null, null);
                displaySearchResultsTable(responseObj, profileType, false);

            })

            /*
             Next Button Click
             */
            $('#nextButton').click(function (event) {
                event.preventDefault();
                var responseObj = callingAjaxFn(searchKeyWord, profileType, next, null, null, null);
                displaySearchResultsTable(responseObj, profileType, false);

            })

            /*
             On Tab Change click function
             */

            $("ul li a").click(function (event) {
                var tabLinkId = event.currentTarget.id;
                profileType = tabLinkId;
                event.preventDefault();
                if (profileType == "favourites")
                {
                    getLocalStorageData();
                } else if (searchKeyWord != " ") {
                    hiddenProgress();
                    document.getElementById("divFavTable").style.display = "none";
                    var responseObj = callingAjaxFn(searchKeyWord, profileType, null, geoLat, geoLong, null);
                    displaySearchResultsTable(responseObj, profileType, true);

                }

            })
			
			
            /* for Tool Tip */
			$("#searchKeyWord").mouseenter(function(){
			  var keyWord=$("#searchKeyWord").val();
			  var length=(null!=keyWord || ""!=keyWord)?(keyWord.trim()).length:0;
			  if(length>0){
			    $("#searchKeyWord").attr('title', '');
                $("#searchKeyWord").attr('data-placement', "bottom");
                $('[data-toggle="tooltip"]').tooltip("disable");
  
			  }
			  else {
			  $("#searchKeyWord").attr('title', 'Please Enter the Search Key');
                    $("#searchKeyWord").attr('data-placement', "bottom");
                    $('[data-toggle="tooltip"]').tooltip("enable");

			  
			  }
			})
			

        })


        /*
         To call for Ajax
         */
        function callingAjaxFn(searchKey, profType, nextPreviousIdent, geolatit, geolongit, isForDetails)
        {
            var responseObject = null;
            $.ajax({
                url: "FBSearch.php",
                type: "GET",
                datatype: "json",
                async: false,
                data: {
                    keyword: searchKey,
                    searchtype: profType,
                    nextPreviousIdentifier: nextPreviousIdent,
                    geoLatitude: geolatit,
                    geoLongitude: geolongit,
                    isCallForDetails: isForDetails
                },
                success: function (response, status, xhr) {
                    responseObject = response;
                },

                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);

                }


            });
            return responseObject;
        }



        /*
         To get Geolocation
         */
        function getLocation() {
            var geoLocation = navigator.geolocation;
            if (null != geoLocation && geoLocation) {
                navigator.geolocation.getCurrentPosition(showGeoPosition);
            } else {
                alert("Browser doesn't support Geolocation");
            }
        }

        /*
         Function to get the Geo Latitude and Longitude 
         */
        function showGeoPosition(position) {
            /*Getting the Latitude and storing in local storage */
            geoLat = position.coords.latitude;
            localStorage.setItem("geoLatitude", geoLat);
            /*Getting the Longitude and storing in local storage */
            geoLong = position.coords.longitude;
            localStorage.setItem("geoLongitude", geoLong);
        }


        function formReset()
        {
            window.location.href = " ";
        }

        /*
         To hide Progress Bar
         */
        function hiddenProgress() {
            if (document.searchform.keyword.value != "") {
                if ("block" == document.getElementById("progressId").style.display) {
                    document.getElementById("progressId").style.display = "none";
                    document.getElementById("typediv").style.display = "block";
                } else {
                    document.getElementById("typediv").style.display = "none";
                    document.getElementById("progressId").style.display = "block";
                }
            }
        }


        /*	
         To get the data stored in local storage	
         */
        function getLocalStorageData()
        {
            var displayFavData = "";
            document.getElementById('divFavTable').style.display = "block";
            document.getElementById('typediv').style.display = "none";
            var length = localStorage.length;
            var isGeoLocationSet = false;
            if (localStorage.getItem("geoLatitude")) {
                if (localStorage.getItem("geoLongitude")) {
                    isGeoLocationSet = true;
                }
            }

            if (length == 2 && isGeoLocationSet) {
                document.getElementById("typeAlertFav").style.display = "block";

            } else if (length == 0) {
                document.getElementById("typeAlertFav").style.display = "block";
            } else {
                document.getElementById("typeAlertFav").style.display = "none";
                for (var i = 0, j = 0; i < length && j < length; i++)

                {
                    var key = localStorage.key(i);
                    if (key == "geoLatitude" || key == "geoLongitude") {
                        continue;
                    }

                    var data = JSON.parse(localStorage.getItem(localStorage.key(i)));
                    var profilePicture = data["picture"];
                    var profileId = data["rowid"];
                    var profileName = data["name"];
                    profileType = data["type"];
                    displayFavData += "<tr id=\"" + profileId + "\">";
                    displayFavData += "<td >" + (j + 1) + "</td>";
                    displayFavData += "<td><img src=\"" + profilePicture + "\"width=\"40px\" height=\"30px\" style=\"border-radius:50%;\"/></td>";
                    displayFavData += "<td>" + profileName + "</td>";
                    displayFavData += "<td>" + profileType + "</td>";
                    displayFavData += "<td><button type=\"button\" class=\"btn btn-default btn-md\" onclick=removeFavItem(" + profileId + ",true)> <span class=\"glyphicon glyphicon-trash\"></span> </button></td>";
                    displayFavData += "<td><button id=\"detailsbtnfav_" + profileId + "\" onclick=\"displayProfileDetails(this,true,'" + profileType + "','" + profileName + "','" + profilePicture + "','" + profileId + "')\" class=\" detailsBtnIdent btn btn-default btn-sm\"><span class=\"glyphicon glyphicon-chevron-right\"></span></button></td>";
                    displayFavData += "</tr>";
                    j++;

                }
            }
            document.getElementById('favTableBody').innerHTML = displayFavData;
            document.getElementById("typediv").style.display = "none";
        }





        /*
         Get the element Id
         */

        function toGetId(elementId) {
            var position = elementId.search("_");
            var profId = elementId.substr(position + 1, elementId.length);
            return profId;
        }

        /*
         To save Profile As Favorite
         */

        function saveProfileAsFav(clickEvent, profileType)
        {
            var isProfileInLocalStorage = false;

            /*get the Id */
            var elementId = clickEvent.id;
            var profileId = toGetId(elementId);
            var localkey = document.getElementById(profileId);
            /*Get the row data  */
            var rowData = localkey.cells;
            var profilePicture = rowData[1].firstChild.currentSrc;
            var profileName = rowData[2].firstChild.data;
			/*To check whether Profile in LocalStorage */
            isProfileInLocalStorage=localKeyStorageArray.includes(profileId)?true:false;
            
            if (isProfileInLocalStorage)
            {
                removeFavItem(profileId,false);
                document.getElementById(elementId).innerHTML = '<span id=\"star\" class=\"glyphicon glyphicon-star-empty \"></span>';
            } else {
                /* To create a json array to store */
                jsonItemToStore = {
                    "rowid": profileId,
                    "name": profileName,
                    "picture": profilePicture,
                    "type": profileType,
                };
                localKeyStorageArray.push(profileId);
                localStorage.setItem(profileId, JSON.stringify(jsonItemToStore));
                document.getElementById(elementId).innerHTML = '<span class="glyphicon glyphicon-star" style="color:yellow"></span>';

            }
        }



        /*
         To remove Local Storage Row Data
         */

        function removeFavItem(rowid,displayFav)
        {
            var length = localStorage.length;
            for (var i = 0; i < length; i++)
            {
                /* To get The Item*/
                var row = JSON.parse(localStorage.getItem(localStorage.key(i)));
                /* To get The Item key*/
                var rowKey = row["rowid"];
                if (rowKey == rowid) {
                    /*Compares whether the item id matches  */
                    localStorage.removeItem(localStorage.key(i));
                    var index = localKeyStorageArray.indexOf(rowKey);
                    /*Removes the item id matches  */
                    localKeyStorageArray.splice(index, 1);
                    if(displayFav) {   
                       getLocalStorageData();
                    }
                    break;
                } else
                {
                    continue;
                }

            }

        }
        /*
         To display search Results Table
         */


        function displaySearchResultsTable(response, profileType, toHideProgress)
        {
            if (null != response) {
                var responseData = response.data;
                var length = 0;
                var appendDataToTable = "";
                if (null != responseData) {
                    length = responseData.length;
                }
                if (length == 0) {
                    document.getElementById("typeAlert").style.display = "block";
                } else if (length > 0) {
                    document.getElementById("typeAlert").style.display = "none";
                }

                var pagingObj = null;
                if (response.hasOwnProperty("paging")) {
                    pagingObj = response.paging;
                }
                if (pagingObj != null && pagingObj.hasOwnProperty("next")) {
                    next = pagingObj.next;
                } else {
                    next = null;
                }
                if (pagingObj != null && pagingObj.hasOwnProperty("previous")) {
                    previous = pagingObj.previous;
                } else {
                    previous = null;
                }
                if (next == null)
                {
                    document.getElementById("nextButton").style.display = "none";
                } else {
                    document.getElementById("nextButton").style.display = "inline-block";
                }
                if (previous == null)
                {
                    document.getElementById("prevButton").style.display = "none";
                } else {
                    document.getElementById("prevButton").style.display = "inline-block";

                }
                for (var i = 0; i < length; i++)
                {
                    var profilePicture = response.data[i].picture.data.url;
                    var profileId = response.data[i].id;
                    var profileName = response.data[i].name;
                    appendDataToTable += "<tr id=\"" + profileId + "\"><td>" + (i + 1) + "</td>";
                    appendDataToTable += "<td><img src=\"" + profilePicture + "\" height=\"50px\" width=\"50px\" style=\"border-radius: 50%; \" /></td>";
                    appendDataToTable += "<td>" + profileName + "</td>";
                    if (localKeyStorageArray.includes(profileId))
                    {
                        appendDataToTable += "<td><button id=\"btn_" + profileId + "\" class=\"btn btn-default btn-sm\" onclick=\"saveProfileAsFav(this,profileType)\"><span class=\"glyphicon glyphicon-star\" style=\"color:yellow\"></span></button></td>"
                    } else
                    {
                        appendDataToTable += "<td><button id=\"favbtn_" + profileId + "\" class=\"btn btn-default btn-sm\" onclick=\"saveProfileAsFav(this,profileType)\"><span id=\"star\" class=\"glyphicon glyphicon-star-empty \"></span></button></td>";
                    }
                    appendDataToTable += "<td><button id=\"detailsbtn_" + profileId + "\" onclick=\"displayProfileDetails(this,false,'" + profileType + "','" + profileName + "','" + profilePicture + "','" + profileId + "')\" class=\"detailsBtnIdent btn btn-default btn-sm\"><span class=\"glyphicon glyphicon-chevron-right\"></span></button></td></tr>";

                }

                $("#profileTypeDataDisp").html(appendDataToTable);
            } else
            {
                document.getElementById("typeAlert").style.display = "block";
            }
            /*To hide progress bar */
            if (toHideProgress) {
                hiddenProgress();
            }
            document.getElementById("displayTableDiv").style.display = "block"

        }

        /*
         
         To display the details page for the requested profile
         */


        function displayProfileDetails(event, isCallFromfav, profileType, profileName, profilePicture, profileId) {
            var isFavItem = localKeyStorageArray.includes(profileId) ? true : false;
            detailsSlideFunc(profileType, profileName, profilePicture, profileId, isFavItem);
            var detailsId = profileId;
            var className = event.className;
            var value = className.search("detailsBtnIdent");
            if (!(value < 0)) {
                detailsExists = "true";
                hideShowElement('albumsprogressId');
                hideShowElement('postsProgressId');
                $.ajax({
                    url: "FBSearch.php",
                    type: "GET",
                    datatype: "json",
                    async: false,
                    data: {
                        searchtype: profileType,
                        nextPreviousIdentifier: null,
                        isCallForDetails: detailsExists,
                        profileId: detailsId

                    },
                    success: function (response, status, xhr) {
                        var profilePicture = response.picture.data.url;
                        var profileName = response.name;
                        var profileDetails = "";
                        /*
                         To get Albums Pictures
                         */
                        var albumsResponse = (response.hasOwnProperty("albums") && (response.albums).hasOwnProperty("data")) ? (response.albums).data : null;
                        var albumsRespLen = (albumsResponse == null) ? 0 : albumsResponse.length;
                        var albumsImagesArray = [];
                        for (var alb = 0; alb < albumsRespLen; alb++)
                        {
                            albumsImagesArray[alb] = [];
                            var images = (albumsResponse[alb].hasOwnProperty("photos") && (albumsResponse[alb].photos).hasOwnProperty("data")) ? albumsResponse[alb].photos.data : null;
                            var imagesLen = (images == null) ? 0 : images.length;
                            for (var pic = 0; pic < imagesLen; pic++) {
                                var eachImageId = images[pic].hasOwnProperty("picture") ? images[pic].id : null;
                                albumsImagesArray[alb][pic] = eachImageId;
                            }
                        }
                        var albumsImagesRespArray = [];
                        $.ajax({
                            url: "FBSearch.php",
                            type: "GET",
                            async: false,
                            data: {
                                picIdsArray: albumsImagesArray,
                                searchtype: null,
                                nextPreviousIdentifier: null,
                                isCallForDetails: "false"
                            },
                            success: function (pictureResponse, status, xhr) {
                                albumsImagesRespArray = pictureResponse;
                            },

                            error: function (jqXHR, textStatus, errorThrown) {
                                console.log(textStatus, errorThrown);
                            }
                        });



                        for (var i = 0; i < albumsRespLen; i++)
                        {
                            if (i == 0) {
                                profileDetails += "<div class=\"panel-group\">";
                            }
                            var images = (albumsResponse[i].hasOwnProperty("photos") && (albumsResponse[i].photos).hasOwnProperty("data")) ? albumsResponse[i].photos.data : null;
                            var imagesLen = (images == null) ? 0 : images.length;
                            profileDetails += "<div class=\"panel panel-default\">";
                            var albumName = albumsResponse[i].hasOwnProperty("name") ? albumsResponse[i].name : "";
                            profileDetails += "<div class = \"panel-heading\"><h4 class'panel-title><a id='ahrefid" + i + "' style=\"font-size:17px;\" onclick=\"albumshideshowfunc('divalbumelem" + i + "')\" href='#ahrefid" + i + "'>" + albumName + "</h4></a></div>";
                            if (i == 0)
                            {
                                profileDetails += "<div  id='divalbumelem" + i + "' style=\"display:block\" class = \"panel-collapse collapse in\">";
                            } else {
                                profileDetails += "<div id='divalbumelem" + i + "' style=\"display:none\" class = \"panel-collapse collapse\">";
                            }
                            profileDetails += "<div class = \"panel-body\">";
                            for (var j = 0; j < imagesLen; j++)
                            {
                                var imageUrl = null !== albumsImagesRespArray[i][j] ? albumsImagesRespArray[i][j] : "";
                                profileDetails += "<div class=\"panel-body\"><img style=\"width:100%;\" src=\"" + imageUrl + "\"/></div>";
                            }
                            profileDetails += "</div></div></div>";
                            if (i == albumsRespLen - 1) {
                                profileDetails += "</div>";
                            }
                        }
                        if (albumsRespLen == 0)
                        {
                            profileDetails += "<div><div class=\"alert alert-warning\" role=\"alert\">No Albums Found</div></div>";
                        }
                        sleep(10);
                        hideShowElement('albumsprogressId');
                        $("#albumsDetailsDiv").html(profileDetails);
                        /*
                         
                         Posts Details
                         */
                        var postsobj = null;
                        var postsResponse = (response.hasOwnProperty("posts") && (response.posts).hasOwnProperty("data")) ? (response.posts).data : null;
                        var postsRespLen = (postsResponse == null) ? 0 : postsResponse.length;
                        profileDetails = "";

                        for (var i = 0; i < postsRespLen; i++)
                        {
                            var postCreatedTime = moment(postsResponse[i].created_time).format("YYYY-MM-DD" + " " + "HH:MM:SS");
                            var postData = "";
                            if (postsResponse[i] != null) {
                                if (postsResponse[i].hasOwnProperty('message')) {
                                    postsData = postsResponse[i].message;
                                } else if (postsResponse[i].hasOwnProperty('story')) {
                                    postsData = postsResponse[i].story;
                                }
                            }
                            profileDetails += "<div  class=\"panel-group\"><div class=\"panel panel-default\">";
                            profileDetails += "<div class = \"panel-collapse\">";
                            profileDetails += "<div style=\"padding:2px 10px\" class=\"media\">";

                            profileDetails += "<div style=\"padding:10px 5px\" class=\"media-left\"><img src=\"" + profilePicture + "\" width=\"50px\" height=\"50px\" /></div>";
                            profileDetails += "<div style=\"padding:8px 10px\" class=\"media-body\"><span style=\"font-size:17px\" >" + profileName + "</span><p style=\"font-size:14px; color:grey\">" + postCreatedTime + "</p></div>";
                            profileDetails += "<p style=\"font-size:16px;padding:8px 5px; \">" + postsData + "</p></div>";
                            profileDetails += "</div></div>";
                            profileDetails += "</div>";
                        }


                        if (postsRespLen == 0) {
                            profileDetails += "<div style=\"padding:0px 12px\" class=\"panel\" ><div class=\"alert alert-warning\" role=\"alert\">No Posts Found</div></div>";
                        }
                        sleep(10);
                        hideShowElement('postsProgressId');
                        $("#postsDetailsDiv").html(profileDetails);

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                    }


                });
            }
        }

        /*
         * 
         * To save Details from Favorite
         */

        function saveDetailsfav()
        {
            var scope = getScopeOffbAppController()
            var profileType = scope.profileUserType;
            var profileName = scope.profileUserName;
            var profilePicture = scope.profileUserPicture;
            var profileId = scope.profileFavId;
            var setIsFav = false;
            var ispresent = false;
            if (localKeyStorageArray.includes(profileId))
            {
                ispresent = true;
            }
            if (!ispresent)
            {
                FavDataVar = {
                    "rowid": profileId,
                    "name": profileName,
                    "picture": profilePicture,
                    "type": profileType,
                };
                localKeyStorageArray.push(profileId);
                localStorage.setItem(profileId, JSON.stringify(FavDataVar));
                setIsFav = true;
            } else {
                removeFavItem(profileId,false);
                setIsFav = false;
            }
            scope.$apply(function () {
                scope.isFavourite = setIsFav;
            })
        }


        /*
         Hide show Element 
         */
        function hideShowElement(id) {
            if (document.getElementById(id).style.display == "block")
            {
                document.getElementById(id).style.display = "none";
            } else {
                document.getElementById(id).style.display = "block";
            }
        }

        /*
         To hide or show Images inside the panel Collapse
         
         */
        function albumshideshowfunc(id) {
            /*
             To get the Albums id   
             */
            var sub = id.substr(0, 12);
            var index = id.substr(12, 13);
            /*
             To hide or show the Album photos   
             */
            if ("block" == document.getElementById(id).style.display)
            {
                document.getElementById(id).style.display = "none";

            } else {
                document.getElementById(id).style.display = "block";
                for (var i = 0; i < 5; i++) {
                    if (i != index) {
                        document.getElementById(sub + i).style.display = "none";
                    }
                }
            }
        }

        /* To create angular module App named FacebookSearchApp*/
        var facebookSearchApp = angular.module('FacebookSearchApp', ['ngAnimate', 'ngTouch']);

        /* To set scope for controller in FacebookSearchApp*/
        facebookSearchApp.controller('fbAppController', function ($scope) {
            $scope.toHideDetails = true;
        })

        /*  To get scope  */
        function getScopeOffbAppController()
        {
            var scope = angular.element($("#ContentDiv")).scope();
            return scope;
        }

        /*Function to set the scope variables to render Details Page*/

        function detailsSlideFunc(type, name, picture, id, isFav) {
            var scope = getScopeOffbAppController()
            scope.$apply(function () {
                scope.toHideDetails = false;
                scope.profileUserType = type;
                scope.profileUserName = name;
                scope.profileUserPicture = picture;
                scope.profileFavId = id;
                scope.isFavourite = isFav;
            })
        }

        function hideDetailsFunc() {
            $("#searchIconId").trigger("click");
            var scope = getScopeOffbAppController()
            scope.$apply(function () {
                scope.toHideDetails = true;
            })
        }


        function sleep(milliseconds) {
            var startTimer = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - startTimer) > milliseconds) {
                    break;
                }
            }
        }
        /*
         Posting to FaceBook
         */
        function feedFacebookPost() {
            var scope = getScopeOffbAppController()
            var profileName = scope.profileUserName;
            var profilePicture = scope.profileUserPicture;
            FB.login(function (response) {
                if (response.authResponse) {
                    FB.ui({
                        method: 'feed',
                        name: profileName,
                        link: 'http://www.facebook.com',
                        picture: profilePicture,
                        caption: 'FB SEARCH FROM USC CSCI571',
                        description: ' ',
                        display: "popup"
                    }, function (response) {
                        if (response) {
                            alert("Posted Successfully");
                        } else {
                            alert('Not Posted');
                        }
                    });

                } else {
                    alert('Not Authenticated Response');
                }
            });
        }

   