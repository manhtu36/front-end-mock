(function ($){
    var btn_login = $('#btn_login')
    var login_api = 'http://localhost:8080/mvc/admin/login'
    $(document).on('click','#btn_login',function (e){
        e.preventDefault()
        let that =$(this)

        let admin_name = $('input[name="admin_name"]').val()
        let pass = $('input[name="pass"]').val()
        
        //console.log(admin_name)
        var formdata=
            {
                "admin_name": admin_name,
                "pass": pass
            }
        call_login_api(formdata)
        let token =getCookie('token')
        //console.log(token)
        if(token){
            window.location.href= 'http://127.0.0.1:5500/index.html' 
        }

    })

    function call_login_api(fromdata){
        var options={
            method :'POST',
            headers:{
                'Content-Type':'application/json'
                
            },
            body :JSON.stringify(fromdata),

        };
        fetch(login_api ,options)
            .then(
                function (response) {

                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {

                        if(data != null) {
                            //console.log(typeof data)
                            let  token = data.token
                            //console.log( token)
                            //$.cookie("token",token)
                            setCookie("token",token,30)

                        }
                    })
                }
            )
            .catch(err => {

            })
    }
    function setCookie(cname,cvalue,exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires=" + d.toUTCString();
        delete_cookie("token")
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // function getCookie(cname) {
    //     let name = cname + "=";
    //     let decodedCookie = decodeURIComponent(document.cookie);
    //     let ca = decodedCookie.split(';');
    //     for(let i = 0; i < ca.length; i++) {
    //         let c = ca[i];
    //         while (c.charAt(0) == ' ') {
    //             c = c.substring(1);
    //         }
    //         if (c.indexOf(name) == 0) {
    //             return c.substring(name.length, c.length);
    //         }
    //     }
    //     return "";
    // }
    const getCookie = (cookieName) => {
        let decodeCookie = decodeURIComponent(document.cookie)
        let cookiesArray = decodeCookie ? decodeCookie.split(';') : []
    
        for (let i = 0; i < cookiesArray.length; i++) {
            let cookie = cookiesArray[i]
            let cookieNew = cookie.replace(' ', '')
            let isExist = cookieNew.includes(cookieName)
            if (isExist) {
                return cookieNew.split('=')[1];
            }
    
        }
        return null
    }

    function checkCookie() {
        let user = getCookie("username");
        if (user != "") {
            alert("Welcome again " + user);
        } else {
            user = prompt("Please enter your name:","");
            if (user != "" && user != null) {
                setCookie("username", user, 30);
            }
        }
    }
    function delete_cookie(name) {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
})(jQuery)


