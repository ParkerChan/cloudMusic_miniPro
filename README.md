# cloudMusic_miniPro
仿网易云微信小程序
# 项目部署
下载好源码后，打开微信开发者工具，切记，一定选择导入，不要选择新建！！！！</br>
选择导入，填写上你自己的云开发ID，就能够成功部署项目了；
# 云函数与云数据库
由于项目是本人21年毕业时写的，且写完后后续就没有续费云开发，所以云数据库表已经找不到了，但仍可以通过写好的云函数查看到用了哪些表，表中有哪些标签；<br>
建议先查看项目的前端代码，重点看前端的js代码，熟悉整个项目的前后端交互流程，然后再去看对应的云函数功能，这样能更清晰，更快掌握项目；<br>
因为是音乐播放器，所以项目本身来说，偏向于前端项目，项目的后端是根据微信小程序提供的登录接口，获取到用户唯一标识“openid”进行识别是否为管理员，代码中我给予了注释，使用过程中可以加上你自己的openid作为管理员身份进行识别，个人界面会根据openid判断是否为管理员，管理员与普通用户的界面不一致，管理员后端可实现对tarbar栏中“音乐中心”的数据进行增删，有数据可视化等基本后端功能。<br>
与后端交互较多的是播放页面、个人主页，这两者是前端与后端交互较多的部分，如果我没有记错的话...<br>
# 如遇问题，可以在B站留言，看到了会回复
【仿网易云音乐的小程序音乐播放器（已开源）】https://www.bilibili.com/video/BV13v411p71j?vd_source=79f1213d4acc7de0153ddb00e3ac7ca8
