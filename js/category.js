(function ($){
    //console.log(config_domain)
    var config_domain = 'http://localhost:8080/mvc/public/image/'
    var btn_category = $('#btn_category')
    var block_btn_create=$('#block_btn_create')
    var table_content= $('#table_content')
    var table_header = $('#table_header')
    var ele_category_name_modal = $('input[name="category_name"]')
    var ele_box_img_modal =$('#box_image')
    
    var category_api = 'http://localhost:8080/mvc/category'
    my_modal_category = $('#my_modal_category')

    

    //function
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
    var token =getCookie('token')
    if(!token){
        window.location.href= 'http://127.0.0.1:5500/login.html' 
    }
    function start(){
        
        handle_get_category()
        handle_delete_category()
        handle_create_category()
        handle_edit_category()
    }

    start()
    
    
    $(document).on('click','#btn_logout',function(e){
        let options={
            method :'DELETE',
            headers:{
                'Content-Type':'application/json',
                'token':token
                
            },
        };
        //console.log(token)

        fetch('http://localhost:8080/mvc/admin/logout',options)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        if(data !=null) {

                            delete_cookie('token')
                            window.location.href= 'http://127.0.0.1:5500/login.html' 
                        }
                        
                    })
                }
            )
            .catch(err => {
            })
    })
    function handle_get_category(){
        $(document).on('click','#btn_category',function (e){

            e.preventDefault()
            //btn_create.css('display','block')

            //console.log(btn_create)

            let that = $(this)
            let btn_create_element='<button id="btn_create_category" >Create</button>'
            block_btn_create.children().remove()
            block_btn_create.append(btn_create_element)
            table_header.children().remove()
            let str_table_header = `<tr>
                                            <td>ID</td>
                                            <td>Category Name</td>
                                            <td>Image</td>
                                            <td> </td>


                                        </tr>`
            table_header.append(str_table_header)
            get_category_api()

        })
    }    

    function handle_delete_category(){

        $(document).on('click','.btn_delete_category',function (e){
            let that = $(this)
            let record_category = that.parents('tr')
            let id = record_category.children('.id_category').text()
            record_category.remove();
            delete_category_api(id)
                
        })
    }
    function handle_edit_category(){
        $(document).on('click','.btn_edit_category',function (e){
            let that =$(this)
            var record_category = that.parents('tr')
            let id = record_category.children('.id_category').text()
            $('#category_id').val(id)
            //console.log(id)
            if($('#btn_save_category')){
                $('#btn_save_category').text("Save News")
                $('#btn_save_category').attr('id','btn_edit_save_category')
            }
            
            
            let  category_name = record_category.children('.category_name').text()
            let td_img = record_category.children('.category_img')
            let category_img=td_img.children().attr('src')
            ele_category_name_modal.val(category_name)
            ele_box_img_modal.children().remove()
            ele_box_img_modal.append('<img class ="img-thumbnail">')
            ele_box_img_modal.children().attr('src',category_img)
            $('#modal_category').modal('show')
            
    
        })
    }
    $(document).on('click','#btn_edit_save_category',function(e){
        category_name=$('input[name="category_name"]').val()
        // console.log(id)
        // console.log(category_name)
        //console.log(ele_box_img_modal.children().attr('src'))
        let id = $('#category_id').val()
        let url_image =ele_box_img_modal.children().attr('src')?ele_box_img_modal.children().attr('src'):''
        // if(url_image.indexOf(config_domain)> -1){
        //     url_image=''
        // }
        
        formdata={
            'category_id':id,
            'category_name':category_name,
            'url_image':url_image
        }
        //console.log(url_image)
        edit_category_api(formdata)
        
        $('#modal_category').modal('hide')
    })
    $('#input_category_image').change(function(){
        let input_image = $('#input_category_image')
        //this.val()=''
        let box_image =$('#box_image')
        //let box_image =$('#box_image').children().remove()
        render_image(input_image,box_image)

     })
    $(document).on('click','#btn_create_category',function(e){
        $('input[name="category_name"]').val('')
        //let box_image =$('#box_image')
        if($('#btn_edit_save_category')){
            $('#btn_edit_save_category').text('Create category')
            $('#btn_edit_save_category').attr('id','btn_save_category')
            
        }
        $('#box_image').children().remove()
        $('#modal_category').modal('show')
    })
    
     
    function handle_create_category(){
        $(document).on('click','#btn_save_category',function (e){
            
            
             let category = $('input[name="category_name"]').val()
             let box_image =$('#box_image')
             let image_base64 =box_image.children().attr('src')?box_image.children().attr('src'):''

            //  if(image_base64.indexOf(config_domain)> -1){
            //     image_base64=''
            // }
             formdata={
                 "category_name":category,
                 "url_image":image_base64
             }
             create_category_api(formdata)
             $('#modal_category').modal('hide')

             //console.log(input_image)
             //console.log(base64)

        })
    }


    function get_category_api(){
        fetch(category_api+'/list')
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        if(data.length) {
                            render_data(data)
                        }
                    })
                }
            )
            .catch(err => {
            })
    }
    function edit_category_api(formdata ){
        var options={
            method :'PUT',
            headers:{
                'Content-Type':'application/json',
                'token':token

            },
            body :JSON.stringify(formdata),
        };
        fetch(category_api+'/update',options)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        if(data !=null) {
                            get_category_api()
                            
                        }

                    })
                }
            )
            .catch(err => {
            })
    }
    function create_category_api(formdata){
        //console.log(555)
        var options={
            method :'POST',
            headers:{
                'Content-Type':'application/json',
                'token':token
            },
            body :JSON.stringify(formdata),

        };
        fetch(category_api+'/create' ,options)
            .then(
                function (response) {

                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        //console.log(444)
                        if(data != null) {
                            
                            let tr_element=`<tr>
                            <td class ="id_category">${data.category_id}</td>
                            <td class="category_name">${data.category_name}</td>
                            <td class="category_img">
                            
                                <img src="${config_domain+ data.url_image}" class="img-thumbnail"></td> 
                                                                         
                            <td>
                                <button class="btn_edit_category">Edit</button>
                                <button class="btn_delete_category">Delete</button>
                            </td>

                        </tr>`
                        
                            table_content.append(tr_element)
                            
                        }
                    })
                }
            )
            .catch(err => {

            })
    }
    function delete_category_api(id){
        var options={
            method :'DELETE',
            headers:{
                'Content-Type':'application/json',
                'token':token
                
            },
        };
        fetch(category_api+'/delete/'+id,options)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        if(data !=null) {

                            return true ;
                        }
                        else {
                            return false ;
                        }
                    })
                }
            )
            .catch(err => {
            })
    }
    function render_data(data){
        var str_content = ''
        for (let i = 0; i < data.length; i++) {
            str_content += `<tr>
                                            <td class ="id_category">${data[i].category_id}</td>
                                            <td class="category_name">${data[i].category_name}</td>
                                            <td class='category_img'>
                                                
                                                <img src="${config_domain+ data[i].url_image}" class="img-thumbnail"></td> 
                                                                                       
                                            <td>
                                                <button class="btn_edit_category">Edit</button>
                                                <button class="btn_delete_category">Delete</button>
                                            </td>

                                        </tr>`

        }
        table_content.children().remove()
        table_content.append(str_content)
    }
    function render_image(input_image,box ){
        //var base64=''
        if(input_image && input_image.prop('files')[0]){
            var reader= new FileReader()
            reader.onload=function(e){
                //base64=e.target.result
                //console.log(base64)
                if(box){
                    box.children().remove()
                    box.append('<img class="img-thumbnail">')
                    box.children().attr('src',e.target.result)
                }
                
                //console.log(e.target.result)
                
            }
            reader.readAsDataURL(input_image.prop('files')[0])
            
        }
        
    }
    function delete_cookie(name) {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

} )(jQuery)
// function
