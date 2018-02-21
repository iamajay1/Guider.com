myApp.controller('indexCtrl', ['$http', '$location', 'queryService', 'authService', function ($http, $location, queryService, authService) {

    var main = this;
    this.log = 0;
    this.sign = 0;

    queryService.log = this.log;
    queryService.sign = this.sign;

    //check if logged
    this.logged = function () {
        if (queryService.log == 1) {
            return 1;
        } else {
            return 0;
        }
    }

    //Get the name of the user
    this.getName = function () {
        //get user if logged in
        queryService.getUser()
            .then(function successCallBack(response) {
                main.user = response.data.name;
                queryService.log = 1;
            });
    }
	this.getId = function () {
        //get user if logged in
        queryService.getUser()
            .then(function successCallBack(response) {
                main.user = response.data.id;
                queryService.log = 1;
            });
    }

    //function to process login
    this.submitLog = function () {

        var data = {
            email: main.email,
            password: main.password
        }

        queryService.login(data)
            .then(function successCallBack(response) {

                main.email='';
                main.password='';
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    var userId;
                    var data = response.data.data;
                    
                    //hide login/signup modal
                    angular.element('#loginModal').modal('hide');

                    //set logged status  
                    queryService.log = 1;

                    //console.log(response.data.token);
                    authService.setToken(response.data.token);
                    
                    $location.path('/dashboard/' + data._id);
                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("Error!! Check console");
            });
    } //end submitLog

	//function to process forgot password
    this.forgotLog = function () {
		
        var data = {
            email: main.email,
            mobileNumber: main.mobileNumber
		//	password: main.password
        }
        queryService.forgot(data)
            .then(function successCallBack(response) {

                main.email='';
                main.mobileNumber='';
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
					var userId;
                    
					authService.setToken(response.data.token);
                    var data = response.data.data;
               
       
                    //set logged status  
					$location.path('/change/' + data._id);				
                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("Error!! Check console");
            });
    
	} //end forgotLog
	
        this.change = function () {

        var data = {
             password: main.password
         }
        queryService.edit(data)
            .then(function successCallBack(response) {

                main.password='';
                 //console.log(response);
                if (response.data.error === true) {
                    alert(response.data.message)
                } else {
                    queryService.log = 1;
                    authService.setToken(response.data.token);
                    var data = response.data.data;
                    $location.path('/');
                }
            }, function errorCallBack(response) {
                //console.log(response);
                if (response.status === 400) {
                    alert(response.data);
                } else {
                    alert(response.data.message);
                }
            });

    } //end submitSign

	//function to process signup
	
    this.submitSign = function () {

        var data = {
            name: main.name,
            email: main.email,
            password: main.password,
            mobileNumber: main.mobileNumber
        }
        queryService.signUp(data)
            .then(function successCallBack(response) {

                main.name='';
                main.email='';
                main.password='';
                main.mobileNumber='';
                //console.log(response);
                if (response.data.error === true) {
                    alert(response.data.message)
                } else {
                    //hide signup modal
                    angular.element('#signupModal').modal('hide');
                    queryService.log = 1;
                    authService.setToken(response.data.token);
                    var data = response.data.data;
                    $location.path('/dashboard/' + data._id);
                }
            }, function errorCallBack(response) {
                //console.log(response);
                if (response.status === 400) {
                    alert(response.data);
                } else {
                    alert(response.data.message);
                }
            });

    } //end submitSign

}]);
    