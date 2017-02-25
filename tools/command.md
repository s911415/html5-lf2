### Compress Pictures

```sh
for /r %f in (lf2_img\*.png) do start magick.exe %f -colors 64 PNG8:"T:\lf2_data_c\%~nf.png"
```
```sh
OR
for /r %f in (lf2_img\*.png) do start optipng.exe %f -o3"T:\lf2_data_c\%~nf.png"
```
