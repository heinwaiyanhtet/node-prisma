import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new Express application
const app = express();

app.use(express.json());

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


app.post(`/post`, async (req, res) => {

    const {title,content,authorEmail} = req.body;

    try {
        const result = await prisma.post.create({
            data: {
                title,
                content,
                published: false,
                author: {
                    connect: {
                        email: authorEmail
                    }
                }
            }
        })
    
        res.json(result);

    } catch (error) {
        console.log(error);
    }

    
})

app.put('/publish/:id',async (req,res) => {

    const {id} = req.params;
    const post = await prisma.post.update({
        where : {
            id : {id: Number(id)},
            data: { published: true },
        }
    })
    res.json(post);
})

app.delete(`/post/:id`, async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    })
    res.json(post)
  })
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
