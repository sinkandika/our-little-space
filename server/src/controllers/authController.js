import { loginService, registerService } from "../services/authService.js"

// REGISTER USER
export const register = async (req, res) => {
  try {
    const user = await registerService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success:false,
      message: err.message,
    });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);

    res.status(200).json ({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (err) {
    res.status(401).json ({
      success: false,
      message: err.message,
    });
  }
};

// CHECK CURRENT USER
export const getCurrentUser = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
    role: req.user.role,
  });
};