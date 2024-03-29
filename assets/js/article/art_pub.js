$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()
    initEditor() //初始化富文本调用的函数
    // 定义加载文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                //    调用模板引擎，渲染分类的
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 用form.render()方法渲染一下表单分类
                form.render()

            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })


    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        console.log(e);
        // 获取到文件的列表数组
        var files = e.target.files
        if (files.length == 0) {
            return layer.msg('请选择文件')
        }
        // 根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
        layer.msg('选择文件成功！')
    })


    // 定义文章的发布状态
    var art_state = '已发布'

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault()
        //  2.基于form表单快速创建一个formDate对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        //    console.log(fd);
        // fd.forEach(function(v,k) {
        //     console.log(k,v);
        

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob)

                // 发起ajax请求
                publishArticle(fd)
            })
        })




        // 定义一个发布文章的方法
        function  publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 如果向服务器提交的是formData格式的数据，必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function(res) {
                      if (res.status !==0) {
                        return layer.msg('发布失败！')
                      }
                      layer.msg('发布文章成功！')
                      location.href = '/assets/article/art_list.html'
                }
            })
        }
        
    })