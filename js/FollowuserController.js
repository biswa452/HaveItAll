﻿(function () {  
    'use strict';
 //    app.filter('reverse', function() {
	//   return function(items) {
	//     return items.slice().reverse();
	//   };
	// });
    app.controller('FollowuserController', function ($scope,$http,$window,$localStorage,$location, $timeout, fetchrecordsCMSService,updateProfileService,removeImageService,getMatercmsService,getProfileService,commonpostService) { 
  		
    

		 var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		 };

		 

		 	$scope.companyList = {};
		 	//$scope.show_tab = 'suggest';
		 	$scope.show_tab = $localStorage.tab_to_view;
		 	//alert($scope.show_tab);

			 $scope.click_on_tab = function (tab_id, divid) {

				
				
				//$timeout( alert(1) ,);

				$timeout(function() { $( "#"+tab_id ).addClass('active'); $( "#"+divid ).addClass('in active');  },  500);

			};

			 $scope.delete_following_company_for_user = function (del_id) {

				//alert(del_id);

				var url_path = serviceurl + "API_following/delete_user_following_company/" ;
				var parameter = {del_id: del_id};
				commonpostService.cmnpost( url_path, parameter).then(after_delete_follow_company_of_user, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_delete_follow_company_of_user = function (data) {
				//console.log(data.del_id);	
				$("#following_company_id"+data.del_id).remove();
				fetch_user_suggested_company();
				fetch_user_not_viewed_company();
				fetch_user_viewed_by_company();

			};

			 $scope.view_a_user_for_company = function (user_id, from_tab) {

				// alert(user_id);
				 $localStorage.tab_to_view = from_tab;
				// alert($localStorage.tab_to_view);


				var url_path = serviceurl + "API_following/view_a_company_by_user/" ;
				var parameter = { company_id:  $localStorage.ses_userdata.users_companyid, user_id:user_id, viewing_type: 'company' };
				commonpostService.cmnpost( url_path, parameter).then(after_view_a_user_for_company, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_view_a_user_for_company = function (data) {
					
				$("#notviewed"+data.user_id).remove();
				// alert(2);
				fetch_user_viewed_by_company();
				//alert(data.user_id);
				$window.location.href = '#!/user/profile/'+data.user_id+'/'; 
				//$state.go("user.profile/"+data.user_id+"/");

			};


			 $scope.follow_a_user_for_company = function (user_id) {

				//alert(user_id);

				var url_path = serviceurl + "API_following/follow_company_by_user/" ;
				var parameter = { company_id: $localStorage.ses_userdata.users_companyid, user_id: user_id, following_type: 'company' };
				commonpostService.cmnpost( url_path, parameter).then(after_follow_user_for_company, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_follow_user_for_company = function (data) {
				//console.log(data.del_id);	
				$("#suggested"+data.user_id).remove();
				$("#notviewed"+data.user_id).remove();
				$("#viewed"+data.user_id).remove();

				fetch_user_following_by_company();


			};



			var fetch_user_follow_company = function (data) {
				$scope.user_following_company_list = data;
				//console.log($scope.companyList);	
			};

			var fetch_company_follow_user = function (data) {
				$scope.company_following_user_list = data;
				//console.log($scope.companyList);	
			};

			var fetch_user_suggested_for_company = function (data) {
				$scope.suggeted_user_for_company_list = data;
				//console.log($scope.companyList);	
			};

			var fetch_not_viewed_company_for_user = function (data) {
				$scope.not_viewed_company_for_user_list = data;
				//console.log($scope.companyList);	

			};

			var fetch_viewed_user_for_company = function (data) {
				$scope.viewed_user_for_company_list = data;
				//alert(JSON.stringify($scope.viewed_user_for_company_list));	
			};


		function fetch_user_following_by_company() {
			//alert($localStorage.ses_userdata.users_id);
			var url_path = serviceurl + "API_following/users_following_by_company/" ;
			var parameter = {company_id: $localStorage.ses_userdata.users_companyid, following_type:'company'};
			commonpostService.cmnpost( url_path, parameter).then(fetch_user_follow_company, errorDetails);
		}

		fetch_user_following_by_company();

			var url_path = serviceurl + "API_following/users_following_by_company/" ;
			var parameter = {company_id: $localStorage.ses_userdata.users_companyid, following_type:'user'};
		 	commonpostService.cmnpost( url_path, parameter).then(fetch_company_follow_user, errorDetails);

		 function fetch_user_suggested_company() {
			var url_path = serviceurl + "API_following/suggeted_users_for_company/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id, company_id: $localStorage.ses_userdata.users_companyid };
			commonpostService.cmnpost( url_path, parameter).then(fetch_user_suggested_for_company, errorDetails);
		 }
		 fetch_user_suggested_company();

		 function fetch_user_not_viewed_company() {
			var url_path = serviceurl + "API_following/suggeted_users_for_company/" ;
			var parameter = {user_id: $localStorage.ses_userdata.users_id, view_status: 'NO', company_id: $localStorage.ses_userdata.users_companyid };
			commonpostService.cmnpost( url_path, parameter).then(fetch_not_viewed_company_for_user, errorDetails);
		 }
		 fetch_user_not_viewed_company();

		 function fetch_user_viewed_by_company() {
			var url_path = serviceurl + "API_following/user_viewing_by_company/" ;
			var parameter = { company_id: $localStorage.ses_userdata.users_companyid, viewing_type:'company'};
			commonpostService.cmnpost( url_path, parameter).then(fetch_viewed_user_for_company, errorDetails);
		 }
		 fetch_user_viewed_by_company();




})
})();
