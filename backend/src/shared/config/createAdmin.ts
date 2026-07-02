import readline from "readline";
import bcrypt from "bcrypt";
import { AdminRepository } from "../../modules/admins/domain/repositories/AdminRepository";
import { MongoAdminRepository } from "../../modules/admins/infrastructure/repositories/MongoAdminRepository";
import { connectDB } from "../db/connectDB";
connectDB()
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

const createAdmin = async () => {
  const adminRepo: AdminRepository = new MongoAdminRepository();

  const name = await ask("Enter admin name: ");
  const email = await ask("Enter admin email: ");

  const existingAdmin = await adminRepo.findByEmail(email);
  if (existingAdmin) {
    console.log("Admin already exists.");
    process.exit(0);
  }

  const phone = await ask("Enter admin phone: ");
  const password = await ask("Enter admin password: ");

  const hashedPassword = await bcrypt.hash(password, 10);


  await adminRepo.create({
    name,
    email,
    phone: Number(phone),
    password: hashedPassword,
  });

  console.log("Admin created successfully.");
  process.exit(0);
};

createAdmin().catch((err) => {
    
  console.error(err);
  process.exit(1);
});