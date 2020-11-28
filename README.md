# 2020Fall  軟體工程專案

新冠肺炎地圖。前端Vue、後端Express、資料庫Postgres、整合Docker-compose。

### 編譯
run the docker-compose
 ```
 # app整個資料夾映射進內部導致Dockerfiles內部初始化npm install時node_modules無法傳到外部，目前想不到其他解決方案。只能從外部先安裝
 $ cd ./app & npm install 

 # 編譯 docker-compose 
 $ docker-compose up -d
 ```

* nginx : port 9000:80
* nodejs: port 4000:3000
* postgres: port 5432:5432 

進入資料庫
```bash=
$ docker exec -it <postgres_containerID> bash

root:/# psql --username=user --dbname=db
```

其他詳細參見 [docker-compose.yml](./docker-compose.yml)

###  資料集描述
* [資料集 rawData](./csvData/csvVisualize.ipynb)
* [清理完成 Data](./csvData/CleanData.ipynb) 

### 資料夾內容
```
software-project
│   README.md
│   docker-compose.yml
│
└───html (前端)
│
└───app (後端 nodejs) 
│  │   Dockerfile
│  │   package.json
│
└───config 
   │   nginx.conf (nginx 配置文件)
   │   init.sql  （資料庫初始化）
```
