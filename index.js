import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new Express application
const app = express();

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server and listen on port 3000
const port = 3000;

app.get('/feed',async (req, res) => {

    const posts = await prisma.post.findMany({
        where: {
            published: true,
        },
        include: {
            author: true
        }
    })
    res.json(posts)

})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
