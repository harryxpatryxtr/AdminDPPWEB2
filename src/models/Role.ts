import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

const Role = models.Role || model("Role", roleSchema);

export default Role;