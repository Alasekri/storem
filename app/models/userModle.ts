import { genSalt, hash } from "bcrypt";
import { UUID, randomUUID } from "crypto";
import { Document, Model, Schema, model, models } from "mongoose";

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  avatar: { url: string; id: UUID };

  verified: boolean;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: Object, url: String, id: randomUUID },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    throw error;
  }
});

const UserModel = models.User || model("User", userSchema);

export default UserModel as Model<UserDocument>;
