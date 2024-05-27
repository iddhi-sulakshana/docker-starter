Run frontend
To run docker image

```bash
cd frontend
docker build -t my-frontend-app .
docker run -e BACKEND_URL="http://localhost:3001" --name frontend -p 80:80 my-frontend-app
```
