(function () {
    angular.module("app.data")
        .factory("wmcdataSvc", function ($http, $q, workspaceUrl,workspaceDataUrl,benchmarksUrl,optimizerUrl,indicesUrl,indicesDataUrl) {
            return {
                getWorkSpace: getWorkSpace,
				getWorkSpaceData : getWorkSpaceData,
				postWorkSpaceData : postWorkSpaceData,
				deleteWorkSpaceData : deleteWorkSpaceData,
				getIndices : getIndices,
				getIndicesData : getIndicesData,
				postCovarMatrix : postCovarMatrix,
				postOptimizer : postOptimizer,
				getBenchmarks : getBenchmarks
            }
			
			
			

			

            function getWorkSpace() {
				var url =  workspaceUrl;
				console.log()
                var defer = $q.defer();
                $http.get(url)
                    .success(function (response) {
                        defer.resolve(response);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    })

                return defer.promise;
            }
			
			
			function getWorkSpaceData(id) {
				var url =  workspaceDataUrl+":"+id;
                var defer = $q.defer();
                $http.get(url)
                    .success(function (response) {
                        defer.resolve(response);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    })

                return defer.promise;
            }
			
			
			
			
			function postWorkSpaceData(data) {
				var url =  workspaceDataUrl+data.workspaceid;
                var defer = $q.defer();
                $http.post(url,data)
                    .success(function (response) {
                        defer.resolve(response);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    })

                return defer.promise;
            }
			
			function deleteWorkSpaceData(ws_id) {
				var url =  workspaceDataUrl+ws_id;
                var defer = $q.defer();
                $http.delete(url)
                    .success(function (response) {
                        defer.resolve(response);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    })

                return defer.promise;
            }
			
			
			function getIndicesData(indicesId) {
				var url =  indicesDataUrl+indicesId;
                var defer = $q.defer();
                $http.get(url)
                    .success(function (response) {
                        defer.resolve(response);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    })

                return defer.promise;
            }
			
			function getIndices() {
				var url =  indicesUrl;
                var defer = $q.defer();
                $http.get(url)
                    .success(function (response) {
                        defer.resolve(response);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    })

                return defer.promise;
            }
			
			function postCovarMatrix(location) {
				var url =  covarmatrixUrl;
                var defer = $q.defer();
                $http.post(url)
                    .success(function (response) {
                        defer.resolve(response);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    })

                return defer.promise;
            }
			
			function postOptimizer(data) {
				var url =  optimizerUrl;
                var defer = $q.defer();
                $http.post(url,data)
                    .success(function (response) {
                        defer.resolve(response);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    })

                return defer.promise;
            }
			
			function getBenchmarks() {
				console.log(benchmarksUrl);
				var url =  benchmarksUrl;
                var defer = $q.defer();
                $http.get(url)
                    .success(function (response) {
                        defer.resolve(response);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    })

                return defer.promise;
            }
			
			
			
           
        });
}());