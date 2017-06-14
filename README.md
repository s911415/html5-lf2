# OOP Lab Little Fighter 2

《小朋友齊打交（二）》（Little Fighter 2，縮寫：LF2）是一款免費的2D格鬥遊戲，亦是《小朋友齊打交》的延續及《小朋友齊打交系列》第二作，僅供Windows平台下載。該作由香港遊戲開發者王國鴻加上黃浩然二人攜手開發。
本專案是要將Windows平台移植部分功能到Web上，使其他平台也可以玩LF2

## 如何安裝##

要安裝本遊戲，請先進入release資料夾，下方有一個執行檔案: [LF2_Setup.exe]，點選後即可安裝本遊戲。
安裝過程中會安裝需要的VC++ Runtime library

## 如何執行遊戲 ##
將遊戲安裝完成後，桌面會有一個Little Fighter 2的捷徑，點選後即可執行。

## 系統需求##
- 瀏覽器: Google Chrome 59.0 或以上
- 記憶體: 2GB 或以上
- 儲存空間: 100MB 或以上
- NodeJS 6.9 或以上 (如果需要編譯原始碼的話)

## 備註 ##
本遊戲需要一個網頁伺服器才能執行，執行檔內已經含有Apache HTTP Server，不需設定即可執行
若要查看技術文件，請至docs.html即可。

## 資料夾說明 ##
release: 安裝檔
docs: 程式文件
src: JS檔案
dist: 編譯過的JS檔案
installer: 所需軟體的安裝檔
server: Apache Server
tools: 在開發過程中寫的小程式
