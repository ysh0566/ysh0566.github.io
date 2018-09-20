(function ($) {

    //时间戳
    function add0(m) {
        return m < 10 ? '0' + m : m
    };

    function getLocalTime(nS) {
        // return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        // return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");

        var ti = new Date(parseInt(nS) * 1000);
        var y = ti.getFullYear();
        var m = ti.getMonth() + 1;
        var d = ti.getDate();
        var h = ti.getHours();
        var mm = ti.getMinutes();
        var s = ti.getSeconds();
        return y + '/' + add0(m) + '/' + add0(d) + ' ' + add0(h) + ':' + add0(mm)+":"+add0(s);
    }

    var params = {
        method: "GTAS_getContractDatas",
        params:["0x2a4e0a5fb3d78a2c725a233b1bccff7560c35610"],
        jsonrpc: "2.0",
        id: "1"
    }
    if(sessionStorage['Contract']){
        params.params[0]=sessionStorage['Contract']
    }
    var HOST = sessionStorage['Host']|| "http://10.0.0.225:8101/"
   var account = sessionStorage['account']||"0xff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"
   var key_price ;
    function getItem(options) {
        var paramsData = Object.assign(params, {}, options)
        $.ajax({
            type: "POST",
            url: HOST,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-Type", "application/json");
            },
            data: JSON.stringify(paramsData),

            success: function (e) {
                console.log(e.result.data.endtime);
                key_price = e.result.data.key_price

                var jackpot= Number( e.result.data.jackpot);
                var multiple=  Number(e.result.data.multiple);
                var previous_jackpot =  Number( e.result.data.previous_jackpot)
                $(".ethglitch.titleglow").html(jackpot / multiple+" TAS")
                $('#last_one').html(e.result.data.last_one)
                $('#round_index').html("第 "+(Number( e.result.data.round)+1)+" 轮")
                var your_keys= JSON.parse(e.result.data.round_list)[e.result.data.round][account]||0

                $('#Use_Vault').html(  (JSON.parse(e.result.data.balance)[account]||0) / (e.result.data.multiple ))
                $('#your_keys').html(your_keys);
                $("#Pre-Seed").html(previous_jackpot/multiple)
                $("#Total").html((jackpot+previous_jackpot)/multiple)
                $("#ActivePot").html((jackpot+previous_jackpot)/multiple)
                $("#TotalKeys").html(e.result.data.current_round_key_count)
                //每隔3秒请求一次
                setTimeout(() => {
                    window.clearInterval(clearTime);
                    getItem({})
                    
                }, 3000);       
              var clearTime =  $.leftTime(getLocalTime(e.result.data.endtime), function (d) {
                    if (d.status) {
                        //d.status 状态//d.d 天 //d.h 时//d.m 分//d.s 秒
                        $(".headtimer").html(`${d.h}:${d.m}:${d.s}`)
                        $(".glow.boxtimer").html(`${d.h}:${d.m}:${d.s}`)
                    }
                });
            }
        });
    }
    getItem({})


    //kye值得变化
    var $inputKeyVlaue = $('#tixToBuy');
    var $inputBottomKey = $("#tixQuotation");
    $inputKeyVlaue.bind("input propertychange", function (e) {
        var numberKey = Number(e.target.value.split(" ")[0]);
        $inputBottomKey.html("@ " + numberKey*key_price + " TAS")

        // console.log(e);
    });
    $('#addOne').click((e) => {
        var inputValue = $inputKeyVlaue.val().split(" ")[0]
        $inputKeyVlaue.val(Number(inputValue) + 1)
        $inputBottomKey.html("@ " + (Number(inputValue*key_price) + 1) + " TAS")
        //队伍选中的人
        // console.log()
    });
    $('#addTwo').click((e) => {
        var inputValue = $inputKeyVlaue.val().split(" ")[0]
        $inputKeyVlaue.val(Number(inputValue) + 2)
        $inputBottomKey.html("@ " + (Number(inputValue*key_price) + 2) + " TAS")
    });
    $('#addFive').click((e) => {
        var inputValue = $inputKeyVlaue.val().split(" ")[0]
        $inputKeyVlaue.val(Number(inputValue) + 5)
        $inputBottomKey.html("@ " + (Number(inputValue*key_price) + 5) + " TAS")
    });
    $('#addTen').click((e) => {
        var inputValue = $inputKeyVlaue.val().split(" ")[0]
        $inputKeyVlaue.val(Number(inputValue) + 10)
        $inputBottomKey.html("@ " + (Number(inputValue*key_price) + 10) + " TAS")
    });
    $('#addHundred').click((e) => {
        var inputValue = $inputKeyVlaue.val().split(" ")[0]
        $inputKeyVlaue.val(Number(inputValue) + 100)
        $inputBottomKey.html("@ " + (Number(inputValue*key_price) + 100) + " TAS")
    });
    //修改host地址
    $('#setHost').click(function(){
        console.log("http://"+ $("#newHost").val());
        HOST= "http://"+ $("#newHost").val()
        $("#Host").html(HOST)
        sessionStorage["Host"]=HOST;
        $('#exampleModal').modal('hide');
        console.log(HOST);
    })
    //修改合约地址
    $("#setContractAddress").click(function () { 
        console.log( params);
        params.params[0]= $("#ContractAddressValue").val()
        console.log( params);
        $('#ContractAddress').modal('hide');
        sessionStorage["Contract"]=params.params[0];
        $("#myAddress").html(getSubStr(params.params[0]))
        getItem({})
     })
     //当前合约地址显示
    //  console.log(params);
     $("#myAddress").html(getSubStr(params.params[0]))
     $("#Host").html( HOST)
    //  console.log(account)
     $("#setAccount").html( getSubStr(account))
     //当前地址
     $("#setaccountAddress").click(function () 
     {  
        account=$("#accountAddressValue").val();
        console.log(account);
        getItem({})
        $("#setAccount").html( getSubStr(account))
        sessionStorage["account"]=account;
        $('#accountAddress').modal('hide');

     })
    //付款
    var sendTASData = {
        method: "GTAS_t",
        params: ["0xff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", "0x9a6bf01ba09a5853f898b2e9e6569157a01a7a00", 1, "{\"FuncName\": \"buy\", \"Args\": [1, 0, 0]}", 24044],
        jsonrpc: "2.0",
        id: "1"
       }

       $("#tixBuy").click(function () {
           var arrayParams = [],ObjectParams={FuncName:"buy",Args:[]}
           var tams= $("input[name='teamselect']:checked").val() || 0;
           ObjectParams.Args=[ Number( $('#tixToBuy').val().split(" ")[0]),Number(tams),0]
           arrayParams.push(account)
           arrayParams.push(params.params[0])
           arrayParams.push($('#tixToBuy').val().split(" ")[0]*key_price)
           arrayParams.push ( JSON.stringify(ObjectParams))
           arrayParams.push(new Date().getTime())

        //    arrayParams.push(tams)
        //    arrayParams.push(tams)
           console.log(arrayParams);
       
        
       console.log(account,tams,params.params[0]);
        payment({params:arrayParams})
        })
       $("#tixReinvest").click(function () {
           var arrayParams = [],ObjectParams={FuncName:"buy",Args:[]}
           var tams= $("input[name='teamselect']:checked").val() || 0;
           ObjectParams.Args=[ Number( $('#tixToBuy').val().split(" ")[0]),Number(tams),1]
           arrayParams.push(account)
           arrayParams.push(params.params[0])
           arrayParams.push(0)
           arrayParams.push ( JSON.stringify(ObjectParams))
           arrayParams.push(new Date().getTime())

        //    arrayParams.push(tams)
        //    arrayParams.push(tams)
           console.log(arrayParams);
       
        
       console.log(account,tams,params.params[0]);
        payment({params:arrayParams})
        })
       function payment(options) { 
        var  Data= Object.assign(sendTASData, {}, options);
        // console.log(a);
        $.ajax({
            type: "POST",
            url: HOST,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-Type", "application/json");
            },
            data: JSON.stringify(Data),
            success:function (data) { 
                 alertify.success(' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提交成功&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                  '); 

             }
            })
        }
        // console.log(getSubStr());
        function getSubStr (str){
            var subStr1 = str.substr(0,5);
            var subStr2 = str.substr(str.length-5,5);
            var subStr = subStr1 + "..." + subStr2 ;
            return subStr;
        }
})(jQuery); 