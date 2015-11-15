(function () {
    angular.module("app.data")
 		.value("workspaceUrl", "http://localhost:8001/workspaces")
		.value("workspaceDataUrl", "http://localhost:8001/workspaces/id/")
		.value("indicesUrl", "http://localhost:8001/indices")
		.value("indicesDataUrl", "http://localhost:8001/indices/id/:")
		.value("covarmatrixUrl", "http://localhost:8001/covarmatrix")
		.value("optimizerUrl", "http://localhost:8001/optimizer")
		.value("benchmarksUrl", "http://localhost:8001/benchmarks");		
		
}());