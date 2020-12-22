<p align="center">
  <img src="https://1.bp.blogspot.com/-QQ7Pk57fp9Q/XnLn77FlI3I/AAAAAAABX0s/PO2ZMxe0SpA_5t-43oBw6t9BPE6dG7stwCNcBGAsYHQ/s400/fight_virus_woman.png" width="250">
  <h2 align="center">新冠肺炎監測地圖</h2>
  <h4 align="center">2020Fall  軟體工程專案</h4>
  <p align="center">新冠肺炎地圖。前端Vue、後端Express、資料庫Postgres、整合Docker-compose。</p>
</p>




## 編譯
**run the docker-compose**
 ```
 # 編譯 docker-compose 
 $ docker-compose up -d
 ```

**Docker PORT**

|Docker NetWork|Outside Port|Inside Port|Image|
|---|---|---|---|
|nginx|9000|80|Nginx|
|app|4000|3000|NodeJS|
|postgres|5432|5432|PostgresQL|

**進入資料庫**
```bash=
$ docker exec -it <postgres_containerID> bash

root:/# psql --username=user --dbname=db
```

其他詳細參見 [docker-compose.yml](./docker-compose.yml)

##  資料集描述
### 來源
* [Novel Corona Virus 2019 Dataset](https://www.kaggle.com/sudalairajkumar/novel-corona-virus-2019-dataset)
* [Population by Country - 2020](https://www.kaggle.com/tanuprabhu/population-by-country-2020)
* [Population](https://dataportal.asia/dataset/202641452_3173)
### 清理過程
* [資料集 rawData](./csvData/csvVisualize.ipynb)
* [清理完成 Data](./csvData/CleanData.ipynb) 

## 資料夾內容
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
