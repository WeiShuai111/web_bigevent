$(function () {
// 调用这个函数获取用户基本信息
     getUserInfo()

    var layer = layui.layer

     $('#btnLogout').on('click',function() {
        layer.confirm('确定要退出？', {icon: 3, title:'提示'}, function(index){
            //do something
            // 1.清空本地存储的token
            localStorage.removeItem('token')
            // 2.重新跳转登陆页面
            location.href = '/login.html'
            // 3.关闭confirm询问框
            layer.close(index);
          });
     })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
      
        success: function (res) {
            if (res.status !==0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvatar渲染用户头像
            renderAvatar(res.data) 

        },
        // // 无论成功或者失败,最终都会调用complete回调函数
        // complete: function(res) {
        //     // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据
        //     console.log(res);
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空confirm
        //         localStorage.removeItem('token')
        //         // 2.强制跳转到登录页面
        //         location.href = '/login.html'
    
        //     }
        // }

    })

}



    //   渲染用户头像
        function renderAvatar(user) {
            // 1.获取用户名称
            var name = user.nickname || user.username
            // 2.设置欢迎文本
            $('#welcome').html('欢迎&nbsp;&nbsp'+ name)
            // 3.按需渲染用户头像
            if (user.user_pic !== null) {
                // 3.1渲染图片头像
               $('.layui-nav-img').attr('src',user.user_pic).show()
               $('.text-avatar').hide()
            }else {
                // 3.2渲染文本头像
                $('.layui-nav-img').hide()
                var first = name[0].toUpperCase()
                $('.text-avatar').html(first).show()

            }
        }