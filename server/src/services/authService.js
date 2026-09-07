import supabase from "../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.js";

// REGISTER USER
export const registerService = async ({
  name,
  email,
  password,
  role = "kitchen",
}) => {
  // check existing email
  const { data: existingUser } = await supabase
    .from("kitchen_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // register and make manual hash password (because we don't use supabase auth)
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("kitchen_users")
    .insert([
      {
        name,
        email,
        password: hashedPassword,
        role,
      },
    ])
    .select()
    .single();
    
    if (error) { // error, not err
      throw new Error(error.message);
    }

    return data;
;}

// LOGIN USER
export const loginService = async ({
  email,
  password,
}) => {
  const { data: user, error } = await supabase
    .from("kitchen_users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    throw new Error("Invalid email and password");
  }

  // login success
  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid email and password");
  }

  // generate jwt 
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};