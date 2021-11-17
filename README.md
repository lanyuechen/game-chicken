## Game Chicken

[微信小游戏服务端接口](https://developers.weixin.qq.com/minigame/dev/api-backend)
[微信公众平台接口调试工具](https://mp.weixin.qq.com/debug/cgi-bin/apiinfo)

### 获取accessToken

```shell
APPID=你的AppId
APPSECRET=你的AppSecret

curl "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}"
```

### 生成matchId

```shell
ACCESS_TOKEN=上一步生成的AccessToken

curl -X POST -d '{"team_count": 2,"team_member_count": 1,"need_room_service_info":1, "game_room_info":{"game_tick": 33, "udp_reliability_strategy": 3,"start_percent": 100, "need_user_info": true, "game_last_time": 1800}}' https://api.weixin.qq.com/wxa/business/gamematch/creatematchrule?access_token=ACCESS_TOKEN
```