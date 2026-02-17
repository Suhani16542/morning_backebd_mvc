require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const userRoutes = require("./routes/user.route");
const formRoutes =require ("./routes/form.route");
const uploadRoutes=require("./routes/upload.route")
const adminRoute=require("./routes/admin.route")
const employeeRoute=require("./routes/employee.route")
const subAdminRoute=require("./routes/subAdmin.route")
const categoryRoute=require("./routes/category.route")
const connectDB=require("./config/db")
const cors = require("cors");

const cookieParser = require("cookie-parser");
const path =require("path");


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(
  cors({
    origin: "http://localhost:5173", // React/Vite
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
  })
);


//connect to data base

connectDB();
app.use(cookieParser());
app.use("/api/v1/user",userRoutes);

app.use("/api/v1/form",formRoutes);


app.use("/api/v1/upload",uploadRoutes);

app.use("/api/v1/admin",adminRoute );

app.use("/api/v1/employees", employeeRoute);

app.use("/api/v1/sub-admin", subAdminRoute);

app.use("/api/v1/categories", categoryRoute);


app.listen(3000, () => console.log("server running on http://localhost:3000"));