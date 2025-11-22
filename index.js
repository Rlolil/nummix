import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import { connectDB } from "./config/db.js";
import payrollRoutes from './routes/payrollroute.js'; 
import assetsRoutes from "./routes/assets.js";
dotenv.config();
import { specs, swaggerUi } from './swagger.js';


const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));
// test route
app.get("/", (req, res) => {
  res.send("Nummix backend işləyir 🚀");
});

connectDB();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use('/api/payroll', payrollRoutes); // Yeni əlavə
app.use('/api/assets',assetsRoutes); // Yeni əlavə


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT}-da işləyir`));
