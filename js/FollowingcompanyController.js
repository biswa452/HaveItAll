﻿(function () {  
    'use strict';
 //    app.filter('reverse', function() {
	//   return function(items) {
	//     return items.slice().reverse();
	//   };
	// });
    app.controller('FollowingcompanyController', function ($scope,$http,$localStorage,$location, $timeout, $state, fetchrecordsCMSService,updateProfileService,removeImageService,getMatercmsService,getProfileService,commonpostService) { 
  		
    

		 var errorDetails = function (serviceResp) {
			$scope.Error = "Something went wrong ??";
		 };

		 

		 	$scope.companyList = {};
		 	$scope.show_tab = $localStorage.tab_to_view ;
		 	//alert($scope.show_tab);

			 $scope.click_on_tab = function (tab_id, divid) {

				
				
				//$timeout( alert(1) ,);

				$timeout(function() { $( "#"+tab_id ).addClass('active'); $( "#"+divid ).addClass('in active');  },  500);

			};

			 $scope.delete_following_company_for_user = function (del_id) {

				

				var url_path = serviceurl + "API_following/delete_user_following_company/" ;
				var parameter = {del_id: del_id};
				commonpostService.cmnpost( url_path, parameter).then(after_delete_follow_company_of_user, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_delete_follow_company_of_user = function (data) {
				//console.log(data.del_id);	
				//alert(data.del_id);
				$("#following_company_id"+data.del_id).remove();
				fetch_user_suggested_company();
				fetch_user_not_viewed_company();
				fetch_user_viewed_company();

			};

			 $scope.view_a_company_for_user = function (company_id, company_user_id,type) {

				//alert(type);

				var url_path = serviceurl + "API_following/view_a_company_by_user/" ;
				var parameter = { company_id: company_id, user_id: $localStorage.ses_userdata.users_id, viewing_type: 'user' };
				commonpostService.cmnpost( url_path, parameter).then(after_view_a_company_for_user, errorDetails);
				//console.log($scope.companyList);	
				$localStorage.to_view_user_id = company_user_id; 
				$localStorage.tab_to_view = type; 
			};

			var after_view_a_company_for_user = function (data) {
				console.log(data);	
				$("#notviewed"+data.company_id).remove();
				fetch_user_viewed_company();
				
				$state.go("user.profile", {user_id:$localStorage.to_view_user_id, usertype:'company'}, {reload: true}); 


			};


			 $scope.follow_a_company_for_user = function (company_id) {

				//alert(company_id);

				var url_path = serviceurl + "API_following/follow_company_by_user/" ;
				var parameter = { company_id: company_id, user_id: $localStorage.ses_userdata.users_id, following_type: 'user' };
				commonpostService.cmnpost( url_path, parameter).then(after_follow_company_for_user, errorDetails);
				//console.log($scope.companyList);	
			};

			var after_follow_company_for_user = function (data) {
				//console.log(data.del_id);	
				$("#suggested"+data.company_id).remove();
				$("#notviewed"+data.company_id).remove();
				$("#viewed"+data.company_id).remove();

				fetch_user_following_company();


			};



			var fetch_user_follow_company = function (data) {
				$scope.user_following_company_list = data;
				//console.log($scope.companyList);	
			};

			var fetch_company_follow_user = function (data) {
				$scope.company_following_user_list = data;
				//console.log($scope.companyList);	
			};

			var fetch_company_suggested_user = function (data) {
				$scope.suggeted_company_for_user_list = data;
				//console.log($scope.companyList);	
			};

			var fetch_not_viewed_company_for_user = function (data) {
				$scope.not_viewed_company_for_user_list = data; 
				console.log(data);	

			};

			var fetch_viewed_company_for_user = function (data) {
				$scope.viewed_company_for_user_list = data;
				//console.log($scope.companyList);	
			};


		function fetch_user_following_company() {
			//alert($localStorage.ses_userdata.users_id);
			var url_path = serviceurl + "API_following/user_following_company/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id, following_type:'user'};
			commonpostService.cmnpost( url_path, parameter).then(fetch_user_follow_company, errorDetails);
		}

		fetch_user_following_company();

			var url_path = serviceurl + "API_following/user_following_company/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id, following_type:'company'};
		 	commonpostService.cmnpost( url_path, parameter).then(fetch_company_follow_user, errorDetails);

		 function fetch_user_suggested_company() {
			var url_path = serviceurl + "API_following/suggeted_company_for_user/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id};
			commonpostService.cmnpost( url_path, parameter).then(fetch_company_suggested_user, errorDetails);
		 }
		 fetch_user_suggested_company();

		 function fetch_user_not_viewed_company() {
			var url_path = serviceurl + "API_following/suggeted_company_for_user/" ;
			var parameter = {user_id: $localStorage.ses_userdata.users_id, view_status: 'NO'};
			commonpostService.cmnpost( url_path, parameter).then(fetch_not_viewed_company_for_user, errorDetails);
		 }
		 fetch_user_not_viewed_company();

		 function fetch_user_viewed_company() {
			var url_path = serviceurl + "API_following/user_viewing_company/" ;
			var parameter = {user_id:$localStorage.ses_userdata.users_id, viewing_type:'user'};
			commonpostService.cmnpost( url_path, parameter).then(fetch_viewed_company_for_user, errorDetails);
		 }
		 fetch_user_viewed_company();




})
})();
