# Build docker image
sudo docker build -t cmc-demo .
sudo docker run -p 49160:3000 -itd cmc-demo