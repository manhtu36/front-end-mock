(function ($){


    //var btn_login = $('#btn_login')
    $(document).on('click','#btn_login',function (e){
        var admin_name = $('input[name="admin_name"]').val()
        var pass = $('input[name="pass"]').val()
        if(admin_name =='' || pass =='' ){
            //window.location.href="" ;
            alert("please write infomation")
        }

    })
})(jQuery)