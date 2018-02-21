myApp.factory('queryService' ,function queryFactory($http , authService , $q){

	var queryArray = {};

	var baseUrl = "http://localhost:1993";

	queryArray.log = 1;
	queryArray.sign = 1;

    //sign up request
	queryArray.signUp =  function(userData){
		return $http.post(baseUrl+'/users/signup' , userData);
	}

    //login request
	queryArray.login =  function(loginData){
		return $http.post(baseUrl+'/users/login' , loginData);
	}
	//forgot request
	queryArray.forgot =  function(forgotData){
		return $http.post(baseUrl+'/users/send' , forgotData);
	}
	queryArray.edit =  function(changeData){
		return $http.put(baseUrl+'/users/edit/:id?_method=PUT' , changeData);
	}


	//get logged in user
	queryArray.getUser = function(){
		if(authService.getToken()){
			return $http.get(baseUrl+'/tickets/current?token='+authService.getToken() , null);
		}else{
			return $q.reject({data:"User not authorized..."});
		}
	}

    //get all queries(admin)
	queryArray.allQueries = function(){
		return $http.get(baseUrl+'/tickets/all?token='+authService.getToken() , null);
	}

    //open/close a query
	queryArray.openClose = function(tno){
		return $http.post(baseUrl+'/tickets/Ticket/'+tno+'/statusChange?token='+authService.getToken() , null);
	}

    //get info of a single query by ticket number
	queryArray.singleQuery = function(tno){
		return $http.get(baseUrl+'/tickets/ticket/'+tno+'?token='+authService.getToken() , null);
	}

    //create a reply on a query
	queryArray.newChatMsg = function(tno , msgData){
			return $http.post(baseUrl+'/tickets/ticket/'+tno+'/query?token='+authService.getToken()  , msgData);
	}

	//create a answer on a query
	queryArray.newAnswer = function(tno , msgData){
		return $http.post(baseUrl+'/tickets/Ticket/Admin/'+tno+'?token='+authService.getToken()  , msgData);
	}

    //delete a query by ticket number
	queryArray.deleteAQuery = function(tno){
		return $http.post(baseUrl+'/tickets/ticket/'+tno+'/delete?token='+authService.getToken()  , null);
	}

    //creating a new query
	queryArray.newQuery = function(id , queryData){
		return $http.post(baseUrl+'/tickets/query?token='+authService.getToken()  , queryData);
	}

    //all queries of a particular user
	queryArray.allQueriesOfAUser = function(id){
		return $http.get(baseUrl+'/tickets/allTickets/'+id+'?token='+authService.getToken()  , null);
	}


	return queryArray;

});//end query service
