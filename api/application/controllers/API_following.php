<?php
error_reporting(0);
set_time_limit(300);
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';


class API_following extends REST_Controller {
	
	public function __construct() {
		parent::__construct();       
		$this->load->helper('url');		
		$this->config->item('base_url');		
		//$this->load->library('email');
		$this->load->database();
		//$this->load->dbforge();			
		$this->load->model('API_model');
		$this->load->model('API_following_company_model');
	}

   /* function index_get()
	{
		$password = '4891566';
		$to = 'bamadebupadhya@gmail.com';
		$message = "Hello User, <br><br>Your password is $password.<br><br><br>Thanks<br>Admin";
		$subject = "Forgot Password";
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		$headers .= 'From: <admin@haveitall.com>$to' . "\r\n";
		//$headers .= 'Cc: sangram@primacpl.com' . "\r\n";
		$mail = mail($to,$subject,$message,$headers);
		//echo $mail.'=sending';exit;
			
	}*/



	function getAllDataofTable_get($table)
	{
		//echo $table;	
		$myrow = $this->API_model->get_master_record($table,"","", "", "ASC");		
		
		if(count($myrow)>0)
		{
			$this->response($myrow, 200); // 200 being the HTTP response code
			//echo '<pre>';print_r($myrow);
		}
		else
		{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}
	}

	function user_following_company_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$userid = $post_data->user_id; 
		$following_type = $post_data->following_type; 
		$company_id = $post_data->company_id;
		$lebel = $post_data->lebel;
		$record = $this->API_following_company_model->following_for_user_company_query( $userid, $following_type, $company_id,$lebel);	
		
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function user_viewing_company_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		//echo "<pre>";print_r($post_data);exit;
		$userid = $post_data->user_id; 
		$viewing_type = $post_data->viewing_type; 
		$company_id = $post_data->company_id; 
		$lebel = $post_data->lebel;  
		$record = $this->API_following_company_model->user_viewed_company_query( $userid, $viewing_type,$company_id ,$lebel) ;	
		
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function suggeted_company_for_user_post()
	{
		//echo $table;	
		$all_company = array();

		$post_data = json_decode(file_get_contents("php://input"));	
		$userid = $post_data->user_id; 
		$view_status = $post_data->view_status; 
		$current_company_id = $post_data->current_company_id; 
		$lebel = $post_data->lebel;  


		$record = $this->API_following_company_model->suggeted_company_for_user_query( $userid, $view_status,'',$current_company_id,$lebel ) ;


		//echo $this->db->last_query();
		if($record['code'] == "")
		{

			foreach ($record as $company_matched) {

					$your_url = base_url()."API/getlocationdata/".$company_matched['company_user_id'];
					//echo $your_url ;
					$cSession = curl_init(); 
					//step2
					curl_setopt($cSession,CURLOPT_URL, $your_url);
					curl_setopt($cSession,CURLOPT_RETURNTRANSFER,true);
					curl_setopt($cSession,CURLOPT_HEADER, false); 
					//step3
					$result=curl_exec($cSession);
					//step4
					curl_close($cSession);
					//print_r($result);
				//$company_matched['location_list'] = json_encode($result); 
				$company_matched['location_list'] = $result; 

				array_push($all_company, $company_matched) ;	

			}

			$this->response($all_company, 200);


		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}


	function delete_user_following_company_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$del_id = $post_data->del_id; 
		//echo "ABCD";

		$record = $this->API_following_company_model->delete_following_for_user_company_query( $del_id ) ;	
		//print_r($record);
		//echo $record['code'] ;

			$return = array('del_id' => $record );
			$this->response($return, 200);


	}

	function follow_company_by_user_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$company_id = $post_data->company_id; 
		$user_id = $post_data->user_id; 
		$following_type = $post_data->following_type; 
		//echo "ABCD";

		$data = array('user_id' => $user_id, 'company_id' => $company_id, 'following_type' => $following_type, );
		$companyid = $this->API_model->insert_cmn_tbl('hia_user_following_company', $data);

			$return = array('company_id' => $company_id, 'user_id' => $user_id );
			$this->response($return, 200);

	}

	function view_a_company_by_user_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$company_id = $post_data->company_id; 
		$user_id = $post_data->user_id; 
		$viewing_type = $post_data->viewing_type; 
		//echo "ABCD";

		$data = array('user_id' => $user_id, 'company_id' => $company_id, 'viewing_type' => $viewing_type, );
		$companyid = $this->API_model->insert_cmn_tbl('hia_user_view_company', $data);

			$return = array('company_id' => $company_id, 'user_id' => $user_id );
			$this->response($return, 200);

	}



/************* COMPANY */ 


	function suggeted_users_for_company_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$userid = $post_data->user_id; 
		$company_id = $post_data->company_id; 
		$view_status = $post_data->view_status; 
		$current_user_id = $post_data->current_user_id; 
		$short_type = $post_data->short_type; 

		
		$record = $this->API_following_company_model->suggeted_users_for_company_query( $userid, $company_id, $view_status, $current_user_id, $short_type ) ;	
		
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function users_following_by_company_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$userid = $post_data->user_id; 
		$company_id = $post_data->company_id; 
		$following_type = $post_data->following_type; 
		$current_user_id = $post_data->current_user_id; 
		$short_type = $post_data->short_type; 

		//echo $short_type ;

		$record = $this->API_following_company_model->company_following_user_query( $company_id, $following_type, $userid, $current_user_id, $short_type ) ;	
		
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function user_viewing_by_company_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$company_id = $post_data->company_id; 
		$viewing_type = $post_data->viewing_type; 
		$current_user_id = $post_data->current_user_id; 
		$short_type = $post_data->short_type; 


		$record = $this->API_following_company_model->user_viewed_by_company_query( $company_id, $viewing_type, "", $current_user_id, $short_type  ) ;	
		
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function no_of_new_followers_of_company_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$company_id = $post_data->company_id; 


		$record = $this->API_following_company_model->new_followers_count_query( $company_id ) ;	
		
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function no_of_new_applicants_of_company_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$company_id = $post_data->company_id; 


		$record = $this->API_following_company_model->new_applicant_count_query( $company_id ) ;	
		
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

	function user_company_matching_criteria_post()
	{
		//echo $table;	
		$post_data = json_decode(file_get_contents("php://input"));	
		$company_id = $post_data->company_id; 
		$user_id = $post_data->user_id; 


		$record = $this->API_following_company_model->user_company_matching_criteria_query( $company_id, $user_id ) ;	
		
		if($record['code'] == "")
		{
			//print_r($record);
			$this->response($record, 200);
		}
		else{
			$Error = array('message' => 'error' );
			$this->response($Error, 200);
		}


	}

  }
