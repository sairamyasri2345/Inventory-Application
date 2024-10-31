const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./userDetails");
require("./productApply"); 

const User = mongoose.model("UserInfo");
const ProductApplication = mongoose.model("ProductApplication");

const app = express();
const JWT_SECRET = "hgyefgjfvhf66y894urhijdpol;{}bsvhjvbhf";

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const mongoUrl = "mongodb+srv://sairamyasri:n11LrQ1ZnGctgyGk@cluster0.tpqyk0h.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

app.post("/empSignup", async (req, res) => {
  const { uname, email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User exists" });
    }

    await User.create({
      uname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (err) {
    res.send({ status: "error", error: err.message });
  }
});

app.post("/empLogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "2h",
      });

      return res.status(200).json({ status: "ok", data: { token, employeeId: user.email } });
    }

    return res.status(401).json({ status: "error", error: "Invalid Password" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ status: "error", error: "Server Error" });
  }
});
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });

    req.userId = decoded.userId;
    next();
  });
};


app.put("/changePassword", verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    user.password = encryptedPassword;
    await user.save();

    res.status(200).json({ status: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ error: "Failed to change password" });
  }
});
app.post("/layout", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({ status: "ok", data: { uname: user.uname, email: user.email } });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.get("/appliedProducts/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  try {
    const products = await ProductApplication.find({ employeeId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});
  
app.get("/appliedProducts", async (req, res) => {
  const { employeeId, productId } = req.query;

  const query = {};
  if (employeeId) query.employeeId = employeeId;
  if (productId) query.productId = productId;

  try {
    const products = await ProductApplication.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});



app.post("/applyProduct", async (req, res) => {
  const { employeeId, employeeName, productName, quantity } = req.body;
  try {
    const productApplication = new ProductApplication({
      employeeId,
      employeeName,
      productName,
      quantity,
      createdAt: new Date(),
    });
    await productApplication.save();
    res.status(200).json(productApplication);
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});



const canEditOrDelete = async (req, res, next) => {
  try {
    const product = await ProductApplication.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const timeDifference = (new Date() - new Date(product.createdAt)) / 60000; // Difference in minutes
    if (timeDifference > 25) {
      return res.status(403).json({ error: "You can only edit or delete the product within 25 minutes of applying." });
    }

    req.product = product;
    next();
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
app.put("/updateProduct/:id", canEditOrDelete, async (req, res) => {
  const { id } = req.params;
  const { employeeId, employeeName, productName, quantity } = req.body;
  
  try {
    const updatedProduct = await ProductApplication.findByIdAndUpdate(
      id,
      { employeeId, employeeName, productName, quantity },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

//   try {
//     const productId = req.params.id;
//     const newStatus = req.body.status;

//     const updatedProduct = await ProductApplication.findByIdAndUpdate(
//       productId,
//       { status: newStatus },
//       { new: true }
//     );

//     if (updatedProduct) {
//       res.status(200).json(updatedProduct);
//     } else {
//       res.status(404).json({ error: 'Product not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update product status' });
//   }
// });
app.put('/appliedProducts/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const newStatus = req.body.status;

    const updatedProduct = await ProductApplication.findByIdAndUpdate(
      productId,
      { status: newStatus },
      { new: true }
    );

    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product status' });
  }
});
app.delete("/deleteProduct/:id", canEditOrDelete, async (req, res) => {
  const { id } = req.params;
  
  try {
    await ProductApplication.findByIdAndDelete(id);
    res.status(200).json({ status: "ok", message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});



const PORT=3003;

app.listen(PORT, () => {
  console.log("Server started on port 3003");
});
