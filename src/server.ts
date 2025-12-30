import dotenv from "dotenv"
import app from "./app"
import { prisma } from "./lib/prisma"

dotenv.config()

const PORT = process.env.PORT || 5000



async function main() {
  try {
    await prisma.$connect()
    console.log("✅ Database Connected")

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    })

  } catch (err) {
    console.error("❌ An Error Occurred:", err)
    await prisma.$disconnect()
    process.exit(1)
  }
}

main()
