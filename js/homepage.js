(function ($){
    var category_list = $('#category_list')
    var news_list =$('#news_list')
    var search_news = $('#btn_search')
    var my_modal =$('#exampleModalLong')
    var modal_body_content = $('#modal_body')
    var modal_title_content =$('#exampleModalLongTitle')
    var category_api = 'http://localhost:8080/mvc/category'
    var news_api = 'http://localhost:8080/mvc/news'
    var config_domain= 'http://localhost:8080/mvc/public/image/'
    $(document).ready(function (){
        
        get_category_api()
        get_news_api()
        paging()

    })
    $(document).on('click','.btn_category',function (e){
        let that = $(this)
        var id = that.attr('id')
        get_news_by_category_api(id)


    })
    $(document).on('click','#btn_search',function (e){
        let keyword = $('input[name="keyword"]').val()
        //console.log(keyword)
        var formdata=
            {
                "keyword": keyword
            }

        search_news_api(formdata)
    })
    $(document).on('click','.btn_detail_news',function (e){
        let that = $(this)
        //console.log(444)
        let id = that.parents('.content').children('h3').attr('id')
        //console.log(id)
        
        get_news_by_id(id)
        $('#my_modal').modal('show')


    })
    $(document).on('click','.btn_page',function(e){
        let that = $(this)
        $('.btn_page').css('background-color','#f8f9fa')
        that.css('background-color','pink')
        let page =that.text()
        paging(page)
        //console.log(page)

    })
    // $('#exampleModalLong').ready(function (){
    //     //console.log(444)
    //     let element_div = $('.click_detail_news')
    //
    //     let id = element_div.attr('id')
    //
    //     let data =get_news_by_id(id)
    //     let modal_body_content = $('#modal_body')
    //     let modal_title_content =$('#exampleModalLongTitle')
    //     modal_body_content.remove()
    //     modal_title_content.remove()
    //
    //     modal_title_content.append('<h1>abc</h1>')
    //     modal_body_content.innerText=data['content']
    //
    // })
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

                            render_data_category(data)
                        }
                    })
                }
            )
            .catch(err => {
            })
    }
    function render_data_category(data){
        let str_content = ''
        for (let i = 0; i < data.length; i++) {
            str_content += `<li class="li_category">
                                <button class="btn_category" id="${data[i].category_id}">
                                    ${data[i].category_name}   
                                </button>
                            </li>`

        }
        category_list.children().remove()
        category_list.append(str_content)
    }
    function get_news_api(){
        fetch(news_api+'/num-record')
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        if(data !=null) {
                            //render_data_news(data)
                            let total_news=data 
                            //console.log(total_news)
                            let total_page = total_news/6
                            let sodu =total_news%6
                            if(sodu!=0){
                                total_page=(total_news-sodu)/6 +1
                            }
                            let ele_page
                            for (let i=1;i<=total_page;i++){
                                //console.log(i)
                                ele_page +='<button  class="btn_page">'+i+'</button>'
                            }
                            $('#paging').children().remove()
                            $('#paging').append(ele_page)
                        }
                    })
                }
            )
            .catch(err => {
            })
    }
    function paging(page=1){
        fetch(news_api+'/page/'+page)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        if(data.length) {
                            render_data_news(data)
                            
                        }
                    })
                }
            )
            .catch(err => {
            })
    }
    function get_news_by_id(id){
        fetch(news_api+'/read-by-id/'+id)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {

                        if(data != null) {
                            let ele_content = '<p>'+data.content+'</p>'
                            let ele_title ='<p>'+data.title+'</p>'
                            modal_body_content.children().remove()
                            modal_title_content.children().remove()

                            modal_body_content.append(ele_content)
                            modal_title_content.append(ele_title)
                            //console.log(typeof data)
                        }
                    })
                }
            )
            .catch(err => {
            })
    }
    function get_news_by_category_api(id){
        fetch(news_api+'/read-by-category/'+id)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        return;
                    }
                    response.json().then(data => {
                        if(data!=null) {
                            render_data_news(data)
                        }
                    })
                }
            )
            .catch(err => {
            })
    }
    function search_news_api(keyword){
        //console.log(keyword)
        var options={
            method :'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body :JSON.stringify(keyword),

        };
        fetch(news_api+'/search',options)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Lỗi, mã lỗi ' + response.status);
                        paging() 
                        return;
                    }
                    response.json().then(data => {
                        if(data.length) {
                            render_data_news(data)
                        }
                        
                    })
                }
            )
            .catch(err => {
            })
    }
    function render_data_news(data){
        let str_content = ''
        for (let i = 0; i < data.length; i++) {
            str_content += `<div class="wrap-content"   >
                                <div class="my-image" >
                                    
                                    <img src="${config_domain+data[i].url_image}" class="img-thumbnail">
                                </div>
                                <div class="content"   >
                                    <h3 class="title" id="${data[i].news_id}" >${data[i].title}</h3>
                                    <p class="summary">${data[i].summary}</p>
                                    <button class="btn_detail_news"> Read More</button>
                                </div>
                            </div>`


        }
        news_list.children().remove()
        news_list.append(str_content)

    }


})(jQuery)