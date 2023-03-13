# cloudMusic_miniPro <br>
仿网易云微信小程序 <br>
小程序效果参见：https://www.bilibili.com/video/BV13v411p71j/ <br>
# 实现功能：<br>
歌曲推荐<br>
FM<br>
每日推荐<br>
歌曲搜索<br>
歌曲播放，支持三种播放模式<br>
迷你播放小窗口<br>
用户登录<br>
查看自己的听歌记录<br>
新建/删除歌单<br>
添加歌曲到喜爱<br>
一个独立的管理员后台可视化<br>
# 你需要怎么做：
如果你需要在本地启动这个项目，首先你需要先下载好我提到的这个API，具体方法参考：<br>
1.node.js安装参考 https://www.runoob.com/nodejs/nodejs-install-setup.html <br>
2.API安装参考 https://www.bilibili.com/read/cv17703962 <br>
然后根据API提供的运行教程启动，然后使用微信开发者工具导入项目，记得一定选择云开发！然后就能看到了！<br>
# 需要修改的地方：
login.js  <br>
listDetail.js <br>
myLike.js <br>
myPlayCount.js <br>
person.js <br>
personlist.js <br>
recommendNew.js <br>
singerDetail.js <br>
以上这些js文件中，都需要你进行手动添加的部分 <br>
着重需要说明的是，对于登录逻辑，由于本项目是两年前开发，当时的API接口对于一些歌单信息，比如每日推荐，精选歌单这类音乐数据，要求在请求的时候携带一个API要求的登录状态，言外之意就是，如果你没有使用API登录接口进行登录就直接请求歌单信息的话，一般获取到的歌曲数量不够，我记得当时我用的时候，没有登陆的话每个歌单只有10首歌，但是登录了就是全的。故，本项目在编写的时候，本人用的自己的网易云音乐账号请求登录后进行的，所以代码中需要你自己手动添加一个网易云账号在里面，以确保获取的歌单内容完全(但现在最新的接口提供的我已经不知道了，可能已经不需要了)；同时，由于项目本身有一个我自己写的后端，所以本人在编写的时候，是根据微信登录接口提供的获取每个微信用户自己唯一标识符"openId"进行判断是否为管理员，这里建议你可以放自己的openId~。<br>
