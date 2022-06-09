# The Coding of Isaac
This repository is splitted in 3 parts stored in the 3 main folders. In each of them a specific readme file explains in more details its content.

- source: The source code of the game "The Coding of Isaac".
- documentation: The documentation of the source code.
- evaluation: Tools and data used and generated for the evaluation of the game.

# Building
To build this project easily you will need docker

```
git clone https://github.com/snail-unamur/Yo-kai-watch.git
cd Yo-kai-watch/source
docker build \
  --no-cache \
  -t yokaiwatch/yokaiwatch:latest .
```
# Launching locally
Using docker after building the image just run the following command

```
docker run -d \
  --name=yokai \
  -e PUID=1000 \
  -e PGID=1000 \
  -e TZ=Europe/Brussels \
  -p 8081:5000 \
  -p 8080:80 \
  yokaiwatch/yokaiwatch:latest
 ```
