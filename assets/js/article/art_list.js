$(function() {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间的过滤器
     template.defaults.imports.dataFormat = function(date) {
           const dt = new Date(date)

           var y = padZero(dt.getFullYear())
           var m =padZero( dt.getMonth() + 1)
           var d = padZero(dt.getDate())

           var hh = padZero(dt.getHours())
           var mm = padZero(dt.getMinutes())
           var ss = padZero(dt.getSeconds())

           return y + '-' + m + '-'+ d +' '+ hh + ':' + mm + ':' + ss
     }
    //定义补零的函数
    function padZero(n) {
       return  n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//默认值第一页
        pagesize: 2,//每页显示几条数据
        cate_id: '',
        state: ''
    }

    initTable()
    initCate()
    // 获取文章列表数据方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !==0 ) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                   var htmlStr = template('tpl-table', res)
                   console.log(res);
                   $('tbody').html(htmlStr)
                //    调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }


    // 初始化文章分类方法
    function initCate() {
         $.ajax ({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                 if (res.status !==0) {
                    return layer.msg('获取数据失败！')
                 }
                 layer.msg('获取分类数据成功！')
                //  调用模板引擎渲染分类的可选项
               var htmlStr =  template('tpl-cate',res)
               $('[name=cate_id]').html(htmlStr)
               form.render()//渲染的方法，把没出来的数据重新渲染
            }
         })
    }


    // 为筛选表单绑定一个submit事件
    $('#form-search').on('submit', function(e){
           e.preventDefault()
        //    获取表单中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })




    // 定义渲染方法
    function renderPage(total) {
        // 这是调用laypage.render()方法
        laypage.render({
            elem: 'pageBox', //分页容器id
            count: total,    //总数据条数
            limit: q.pagesize ,  //每页显示几条数据
            curr: q.pagenum , //设置默认被选中的分页
            layout: ['count','limit','prev','page','next','skip'],
            limits: [2,3,5,10],
            // 分页发生切换的时候，触发jump回调
            // 触发jump回调1.点击页码就会回调2.只要调用laypage.render()
            jump: function(obj,first) {
                console.log(first);
                // console.log(obj.curr);
                q.pagenum = obj.curr
                // 根据最新的q获取对应的数据并渲染表格
                q.pagesize = obj.limit
                //  initTable()
                if ( !first) {
                    initTable()
                }
            }
        })

    }




   


    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click','.btn-delete',function() {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url:'/my/article/delete/'+ id,
                success: function(res) {
                     if (res.status !==0) {
                        return layer.msg('删除文章失败！')
                     }
                     layer.msg('删除文章成功！')
                    //  数据删完了，页码值减一
                    initTable()
                 if (len === 1) {
                    q.pagenum = q.pagenum === 1 ?  1 : q.pagenum - 1
                 }
                   
                }
            })
            layer.close(index);
          });
    })

   




})