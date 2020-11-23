# 2020Fall  軟體工程專案

新冠肺炎地圖。前端Vue、後端Express、資料庫Postgres、整合Docker-compose、導入Jenskin 做CI/CD (雖然其實沒有測試，但是一鍵部屬、快樂無窮)

### 編譯
run the docker-compose 
 ```
 $ docker-compose up -d
  ```

* nginx : port 9000:80
* nodejs: port 6000:3000
* postgres: port 5432:5432 

進入資料庫
```bash=
$ docker exec -it <postgres_containerID>

root:/# psql --username=user --dbname=db
```

其他詳細參見 [docker-compose.yml](./docker-compose.yml)

###  資料集描述
* [資料集 rawData](./csvData/csvVisualize.ipynb)
* [清理完成 Data](./csvData/csvClean.ipynb) 

### 資料夾內容
```
software-project
│   README.md
│   docker-compose.yml
│
└───html (前端)
｜
└───app (後端 nodejs) 
│  │   Dockerfile
│  │   package.json
│
└───config 
      │    nginx.conf (nginx 配置文件)
      │    init.sql  （資料庫初始化）
```
