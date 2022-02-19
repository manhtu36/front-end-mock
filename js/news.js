(function ($) {
    var btn_news = $('#btn_news')
    var block_btn_create = $('#block_btn_create')
    var table_content = $('#table_content')
    var table_header = $('#table_header')
    var btn_create = $('#btn_create')
    var news_api = 'http://localhost:8080/mvc/news'
    var category_api = 'http://localhost:8080/mvc/category'
    config_domain = 'http://localhost:8080/mvc/public/image/'
    var ele_news_name_modal = $('input[name="news_name"]')
    var ele_box_img_modal = $('#box_image_news')
    var ele_select_category = $('#select_category_id')
    

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
    var token = getCookie('token')

    function start() {
        
        
        // console.log(token)
        // if(token !=''){
        //     window.location.href= 'http://127.0.0.1:5500/index.html'
        //     return  ;
        // }
        handle_get_news()
        handle_delete_news()
        //handle_create_news()
        handle_edit_news()
    }
    start()
   

    $(document).on('click', '#btn_create_news', function (e) {
        
        if($('#btn_edit_save_news')){
            $('#btn_edit_save_news').text('Create News')
            $('#btn_edit_save_news').attr('id', 'btn_save_news')
        }
        
        //console.log(ele_select_category)
        fetch(category_api + '/list')
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        if (data.length) {
                            let str_content
                            for (let i = 0; i < data.length; i++) {
                                str_content += `<option value="${data[i].category_id}">${data[i].category_name}</option>`


                            }
                            ele_select_category.children().remove()
                            ele_select_category.append(str_content)

                        }
                    })
                }
            )
            .catch(err => {
            })
        CKEDITOR.instances.news_content.setData('<p></p>');
        $('#news_title').val('')
        $('#news_summary').val('')
        $('#news_keyword').val('')
        $('#box_image_news').children().remove()
        $('#input_news_image').val('')
        $('#modal_news').modal('show')



        //console.log(input_image)
        //console.log(base64)

    })
    function handle_get_news() {
        $(document).on('click', '#btn_news', function (e) {

            e.preventDefault()
            btn_create.css('display', 'block')
            //console.log(btn_create)

            let that = $(this)
            let btn_create_element = '<button id="btn_create_news" >Create</button>'
            block_btn_create.children().remove()
            block_btn_create.append(btn_create_element)
            table_header.children().remove()
            let str_table_header = `<tr>
                                            <td>ID</td>
                                            <td>Catrgory Name</td>
                                            
                                            <td>Title</td>
                                            <td>Summary</td>
                                            <td>Keyword</td>
                                            <td>Image </td>
                                            <td> </td>


                                        </tr>`
            table_header.append(str_table_header)
            get_news_api()

        })
    }

    function handle_delete_news() {

        $(document).on('click', '.btn_delete_news', function (e) {
            let that = $(this)
            let record_news = that.parents('tr')
            let id = record_news.children('.id_news').text()
            //console.log(id)
            record_news.remove();
            delete_news_api(id)




        })
    }
    function handle_edit_news() {
        $(document).on('click', '.btn_edit_news', function (e) {
            let that = $(this)
            let record_news = that.parents('tr')
            var id = record_news.children('.id_news').text()
            //console.log(id)
            //get data
            if($('#btn_save_news')){
                $('#btn_save_news').text('Edit News')
                $('#btn_save_news').attr('id', 'btn_edit_save_news')
            }
            $('#news_id').val(id)
            // console.log($('#news_id').val())
            
            let category_id = record_news.children('.category_id').text()
            let news_title = record_news.children('.news_title').text()
            let news_summary = record_news.children('.news_summary').text()
            let news_keyword = record_news.children('.news_keyword').text()
            let news_content = record_news.children('.news_content').text()

            // console.log(news_title)
            // console.log(news_summary)
            // console.log(news_content)
            // console.log(news_keyword)
            let td_img = record_news.children('.news_img')
            let news_img = td_img.children().attr('src')

            //get list category_id
            fetch(category_api + '/list')
                .then(
                    function (response) {
                        if (response.status !== 200) {
                            console.log('Lỗi, mã lỗi ' + response.status);
                            return;
                        }
                        response.json().then(data => {
                            if (data !=null) {
                                let str_content
                                for (let i = 0; i < data.length; i++) {
                                    let selected = category_id==data[i].category_id?'selected':''
                                    str_content += `<option value="${data[i].category_id}" ${selected} >${data[i].category_name}</option>`
                                    

                                }
                                ele_select_category.children().remove()
                                ele_select_category.append(str_content)

                            }
                        })
                    }
                )
                .catch(err => {
                })


            //$("#select_category_id option:selected").val(category_id)
            // $("#select_category_id option:selected").text(category_id)
            $('#news_title').val(news_title)
            //$('#news_content').val(news_content)
            $('#news_summary').val(news_summary)
            $('#news_keyword').val(news_keyword)
            let content = '<p>' + news_content + '</p>'
            CKEDITOR.instances.news_content.setData('<p>' + content + '</p>');
            ele_box_img_modal.children().remove()
            ele_box_img_modal.append('<img class ="img-thumbnail">')
            ele_box_img_modal.children().attr('src', news_img)
            $('#modal_news').modal('show')
            
        })
    }
    $(document).on('click', '#btn_edit_save_news', function (e) {
        let id = $('#news_id').val()
        
        let category_id =$("#select_category_id option:selected").val()
        //console.log(category_id)
        let content = CKEDITOR.instances['news_content'].getData();
        let title = $('#news_title').val()
        let summary = $('#news_summary').val()
        let keyword = $('#news_keyword').val()
        let url_image = $('#box_image_news').children().attr('src')
        //console.log(url_image)
        let d = new Date()
        let update_at = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getUTCDate()
        // if (url_image.indexOf(config_domain) > -1) {
        //     url_image = ''
        // }
        formdata = {
            "news_id": id,
            "category_id": category_id,
            "content": content,
            "title": title,
            "summary": summary,
            "keyword": keyword,
            "url_image": url_image,
            "create_at": '',
            "update_at": update_at
        }
        //console.log(formdata)
        edit_news_api(formdata)
        $('#modal_news').modal('hide')

    })


    $(document).on('click', '#btn_save_news', function (e) {
        let category_id = $("#select_category_id option:selected").val()
        //console.log(category_id)
        
        let content = CKEDITOR.instances['news_content'].getData();
        let title = $('#news_title').val()
        let summary = $('#news_summary').val()
        let keyword = $('#news_keyword').val()
        let url_image = $('#box_image_news').children().attr('src') ? $('#box_image_news').children().attr('src') : ''
        //console.log(url_image)
        let d = new Date()
        let created_at = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getUTCDate()


        formdata = {
            "category_id": category_id,
            "content": content,
            "title": title,
            "summary": summary,
            "keyword": keyword,
            "url_image": url_image ? url_image : '',
            "create_at": created_at,
            "update_at": ''
        }
        create_news_api(formdata)

        $('#modal_news').modal('hide')


    })
    function get_news_api() {
        fetch(news_api + '/list')
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        if (data != null) {
                            render_data(data)
                        }
                    })
                }
            )
            .catch(err => {
            })
    }
    function delete_news_api(id) {
        var options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
        };
        fetch(news_api + '/delete/' + id, options)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        if (data != null) {
                            //console.log(typeof data)
                            return 1
                        }
                        else {
                            return 0
                        }
                    })
                }
            )
            .catch(err => {
            })
    }
    function create_news_api(formdata) {
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(formdata),

        };
        fetch(news_api + '/create', options)
            .then(
                function (response) {

                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        //console.log(444)
                        if (data != null) {

                            let tr_element = `<tr>
                            <td class ="id_news">${data.news_id}</td>
                            <td class="category_id">${data.category_id}</td>
                            <td> ${data.category_name}</td>
                            <td class="news_content">${data.content}</td>
                            <td>${data.title}</td>
                            <td>${data.summary}</td>
                            <td>${data.keyword}</td>
                            <td class="news_img"><img src="${config_domain + data.url_image}" class="img-thumbnail"></td></td>
                            <td>
                                <button class="btn_edit_news">Edit</button>
                                <button class="btn_delete_news">Delete</button>
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
    function edit_news_api(formdata) {
        var options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(formdata),

        };
        fetch(news_api + '/update', options)
            .then(
                function (response) {

                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        //console.log(444)
                        if (data != null) {
                            get_news_api()

                        }
                    })
                }
            )
            .catch(err => {

            })
    }
    function render_data(data) {
        let str_content = ''
        for (let i = 0; i < data.length; i++) {
            str_content += `<tr>
                                            <td class ="id_news">${data[i].news_id}</td>
                                            <td class="category_id">${data[i].category_id}</td>
                                            <td class="category_name">${data[i].category_name}</td>
                                            <td class="news_content">${data[i].content}</td>
                                            
                                            <td class="news_title">${data[i].title}</td>
                                            <td class="news_summary">${data[i].summary}</td>
                                            <td class="news_keyword">${data[i].keyword}</td>
                                            <td class="news_img"><img src="${config_domain + data[i].url_image}" class="img-thumbnail"></td></td>
                                            <td>
                                                <button class="btn_edit_news">Edit</button>
                                                <button class="btn_delete_news">Delete</button>
                                            </td>

                                        </tr>`


        }
        table_content.children().empty()
        table_content.append(str_content)
    }
    $('#input_news_image').change(function () {
        let input_image = $('#input_news_image')
        
        
        //this.val()=''
        let box_image = $('#box_image_news')
        render_image(input_image, box_image)

    })
    function render_image(input_image, box) {
        //var base64=''
        if (input_image && input_image.prop('files')[0]) {
            var reader = new FileReader()
            reader.onload = function (e) {
                //base64=e.target.result
                //console.log(base64)
                if (box) {
                    box.children().remove()
                    box.append('<img class="img-thumbnail">')
                    box.children().attr('src', e.target.result)
                }

                //console.log(e.target.result)

            }
            reader.readAsDataURL(input_image.prop('files')[0])

        }

    }


})(jQuery)
// function
