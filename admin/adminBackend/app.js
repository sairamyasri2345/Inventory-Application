const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("./adminDetails");
require("./productschema");
  require('./empSchema');

const User = mongoose.model("AdminPageInfo");
const Product = mongoose.model("Product");
const Employee = mongoose.model("Employee");

const app = express();
const JWT_SECRET =
  "grfehoirhgioujgwlkenjgiorhjhfqekkrhioeyh4i5otby5uyhoui4iy90385ujtm67893-=u4j";

app.use(cors());
app.use(express.json());

const mongoUrl =
  "mongodb+srv://sairamyasri:n11LrQ1ZnGctgyGk@cluster0.tpqyk0h.mongodb.net/?retryWrites=true&w=majority";

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

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "2h",
      });

      return res.status(200).json({ status: "ok", data: token });
    } else {
      return res.status(401).json({ status: "error", error: "Invalid Password" });
    }
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

    res
      .status(200)
      .json({ status: "ok", data: { uname: user.uname, email: user.email } });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// app.use(express.static(path.join(__dirname, 'admin/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

app.post("/products", async (req, res) => {
  const { productName, quantity, description} = req.body;

  try {
    const newProduct = new Product({
      productName,
      quantity,
      description,
    
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ status: "ok", data: savedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { productName, quantity, description} = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productName, quantity, description, },
      { new: true }
    );

    res.status(200).json({ status: "ok", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ status: "ok", data: products });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

//add employee
// app.post('/addEmployees', async (req, res) => {
//   try {
  
//     const newEmployee = await Employee.create({
//       ...req.body
//     });
//     res.status(200).json(newEmployee);
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving employee' });
//   }
// });
app.post("/addEmployees", async (req, res) => {
  try {
    const { employeeId, email, name, password } = req.body;

    // Check for existing employee logic
    const existingEmployee = await Employee.findOne({
      $or: [{ employeeId }, { email }]
    });

    if (existingEmployee) {
      return res.status(409).json({ message: "Employee ID or Email already taken." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new employee with the hashed password
    const newEmployee = new Employee({ ...req.body, password: hashedPassword });
    await newEmployee.save();

    return res.status(201).json(newEmployee);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error occurred.' });
    console.error("Error saving employee:", error);
  }
});




app.get('/employeeData', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// emp_secret="sedrcfvgbhjne7fstfyegbh5hrwygbtruiygbhutierghwgeu5tbui4wiehtuebrteh"

// app.post("/getEmployeeDetails", async (req, res) => {
//   const { email, password,name } = req.body;

//   try {
//       const employee = await Employee.findOne({ email });

//       if (!employee) {
//           return res.status(404).json({ message: "Employee not found" });
//       }

//       // Compare the plain text password directly
//       if (password === employee.password) {
//         console.log("Password match for:", email);
//           const token = jwt.sign({ employeeId: employee.employeeId },emp_secret, {
//               expiresIn: "2h",
//           });

//           return res.status(200).json({
//               status: "ok",
//               token,
//               employee: {
//                   email: employee.email,
//                   employeeId: employee.employeeId,
//                   employeeName: employee.name,
//               },
//           });
//       } else {
//           return res.status(401).json({ message: "Invalid credentials" });
//       }
//   } catch (error) {
//       console.error("Error during login:", error);
//       res.status(500).json({ message: "Server error", error });
//   }
// }); 


app.post('/getEmployeeDetails', async (req, res) => {
  const { email } = req.body;

  try {
      const employee = await Employee.findOne({ email });

      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      res.status(200).json({
          status: 'ok',
          employee: {
              email: employee.email,
              password: employee.password,
              employeeId: employee.employeeId,
              employeeName:employee.name
          },
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});
app.delete("/deleteEmployee/:id", async (req, res) => {
  const id = req.params.id;
  console.log("Received ID for deletion:", id);
  
  try {
    const result = await Employee.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error while deleting employee:", error.message);
    res.status(500).json({ message: "Error deleting employee" });
  }
  });

const PORT=3001;

app.listen(PORT, () => {
  console.log("Server started on port 3001");
});
