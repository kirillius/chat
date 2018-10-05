angular
    .module('app')
    .service('rest', ['$http', function($http){

        var service = {
            baseUrl: '/api/',

            ajax: function(method, uri, data){
                var url = this.baseUrl + uri;
                method = method.toUpperCase();

                console.log(method + ' request: "' + url + '":', data);

                var httpConfig = {
                    method: method,
                    url: url,
                    data: data,
                    timeout: 600000
                };

                return $http(httpConfig).then(function(response){
                    console.log(method + ' response: "' + url + '":', response.data);

                    response.alert = {
                        code: response.data.errorCode,
                        type: response.data.errorCode == "200" ? "success" : "danger",
                        text: response.data.errorMessage
                    };

                    if(response.data && !response.data.length)
                        response.data.statusCode = response.status;

                    return response.data;
                }, function(response){
                    response.alert = {
                        code: response.data.errorCode,
                        type: "danger",
                        text: "Ошибка на сервере. Обратитесь к администратору."
                    };

                    response.data.err = true;
                    return response.data;
                });
            },
            get: function(uri){
                return this.ajax('get', uri);
            },
            post: function(uri, data){
                return this.ajax('post', uri, data);
            },
            put: function(uri, data){
                return this.ajax('put', uri, data);
            },
            delete: function(uri){
                return this.ajax('delete', uri);
            }
        };

        return service;
    }]);