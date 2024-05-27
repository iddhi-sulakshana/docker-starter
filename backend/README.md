Run backend
Create volume for images folder

```bash
docker volume create image_uploads
```

To run docker image

```bash
cd backend
docker build -t my-backend-app .
docker run -d -p 3000:3000 -e MONGODB_URI="mongodb://admin:password@mongodb:27017/docker_starter?authSource=admin" --network mongo-network -v image_uploads:/usr/src/app/images --name backend my-backend-app
```
