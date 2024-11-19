import { SignupFormSchema, FormState } from "@/app/lib/definitions";
const bcrypt = require('bcrypt');

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  const response = await fetch("/api/createUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: hashedPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return {
      errors: errorData.details,
    };
  }

  const userData = await response.json();
  return {
    user: userData,
  };
}
