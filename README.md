# Next.js・MySQLのお問い合わせフォームシステム

## 実行方法

以下の環境変数をルート直下の`.env`に記述

```.env
MYSQL_HOST=ホスト名
MYSQL_USER=ユーザー名
MYSQL_PORT=ポート
MYSQL_PASSWORD=パスワード
MYSQL_DATABASE=DB名
TZ=タイムゾーン
```

以下のコマンドでコンテナ起動

```
docker compose up -d
```