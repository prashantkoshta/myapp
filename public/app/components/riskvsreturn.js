var chartAPI = {};


$(function () {

    var passObject;

    $('#container').on("click",function(evt){
        console.log("container",evt);
    });

    $('#container').highcharts({
        title: {
            text: '',
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {   tickmarkPlacement: 'on'
        },
        yAxis: {
            title: {
                text: 'Expected Return'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            
        },
        tooltip: {
            useHTML: true,
            formatter: function() {
                var str = "";
                str += "Risk: " +  this.x;
                str += " / Bench: " + this.total.risk + "</br>";
                str += "Return: " + this.y;
                str += " / Bench: " + this.total.ret + "</br>";
                return str;  
            }
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            layout: 'horizontal',
            x: 0,
            y: 20,
            itemDistance:20,
            //backgroundColor: '#abddce',
            borderColor: '#74b6b2',
            borderWidth: 1
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function (evt) {
                            passObject = this.total;
                           // console.log("%%%%%%%%%5",evt,passObject);
                            $(".chart-tooltip").show();
                            $(".chart-tooltip").css("top", evt.pageY + 23);
                            $(".chart-tooltip").css("left", evt.pageX - 40);
                        }
                    }
                }
            }
        }
    });

    chartAPI.chart = Highcharts.charts[0];

    chartAPI.setCopyToWorkspace = function(cb) {
        chartAPI.copyToWorkspaceRef = cb;
    }

    chartAPI.setCopyToNewWorkspace = function(cb) {
        chartAPI.copyToNewWorkspaceRef = cb;
    }

    chartAPI.addSeries = function(data) {
        console.log("chartAPI.addSeries :",data);
        $(window).focus();
        //alert("I am here");
        chartAPI.chart.addSeries({
            name: data[0].name,
            data: data
        });

        $(".chart-tooltip").hide();

       
    }

    $("#btnCopyToWorkspace").click(function() {
        console.log(">>>>>>>>>>>>",passObject);
        chartAPI.copyToWorkspaceRef(passObject);
        $(".chart-tooltip").hide();
    });

    $("#btnCopyToNew").click(function() {
        //console.log(">>>>>>>>>>>>",passObject);
        chartAPI.copyToNewWorkspaceRef(passObject);
        $(".chart-tooltip").hide();
    });
    
    
	$('#dropdown').change(function() {
        var chart = $('#container').highcharts();
        
        if($('#dropdown').val() == "print") {
            chart.print();
        }
        else {
            chart.exportChart({
                type: $('#dropdown').val()
            });
        }
    });

    $(document).on("click",function(evt){
        var tar = evt.target;
        if($(".chart-tooltip").find(evt.target).length >0 || $(".chart-tooltip") == $(evt.target)){

        }else{
            $(".chart-tooltip").hide();
        }
        //console.log("docuemnt",evt);
    });
   

   //$(".chart-tooltip").hide();

});