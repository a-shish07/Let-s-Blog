const { Router}  = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');


const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName);
    },
  });

  const upload = multer({ storage: storage })

router.get("/add-new", (req, res) =>{
    return res.render("addBlog", {
        user: req.user,
    });
});

router.get("/:id", async (req, res) => {
  try {
      const blog = await Blog.findById(req.params.id).populate("createdBy");
      console.log("blog", blog);
      if (!blog) {
          return res.status(404).send("Blog not found");
      }
      return res.render('blog', {
          user: req.user,
          blog,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
  }
});


router.post("/",upload.single('coverImage'), async(req, res) =>{
    // console.log(req.body);
    // console.log(req.file);
    const {title, body} = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImage: `/uploads/${req.file.filename}`

    })
    console.log(blog);
    return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;