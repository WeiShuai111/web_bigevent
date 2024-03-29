$(function() {
    // 点击去注册账号的链接
    $('#link_reg').on('click',function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })



    // 点击去登录的链接
    $('#link_login').on('click',function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })


    //  从layui获取form对象
    var form = layui.form
    var layer= layui.layer

    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个pwd的检验规则
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位,且不能出现空格'],
        // 校验两次密码是否相同
        repwd: function(value) {
            // 通过行参拿到密码框和再次确认密码框两者值是否相同，并判断
            var ped = $('#form_reg [name=password]').val()
            if ( ped !== value ) {
                return '两次密码不一致'
            }

        }
        });      


    //    监听注册表单的提交事件
    $('#form_reg').on('submit',function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        var data = $(this).serialize()
        // 可以用一个个提取出表单的数据var data ={ username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()}
        $.post('/api/reguser',data,
        function(res) {
            if (res.status !== 0) {
             return   layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
            $('#link_login').click()

        })

    })



    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !==0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登陆成功')
                // 跳转到后台主页
                // console.log(res.token);
                // 登录成功后把得到的token字符串保存在localstorage中
                localStorage.setItem('token',res.token)
                location.href = '/index.html'
            }

        })

    })

    
    
    
    
    
    

})