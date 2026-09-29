import "dotenv/config";
import bcrypt from "bcrypt";
import {prisma} from "../src/lib/prisma";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "System Administrator";

if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before running prisma db seed");
}

const main = async () => {
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.facultyMember.upsert({
        where: {email},
        update: {name, password: passwordHash, canLogin: true, role: "SUPER_ADMIN"},
        create: {name, email, password: passwordHash, canLogin: true, role: "SUPER_ADMIN"},
    });

    console.log(`Super admin seeded for ${email}`);
};

main().finally(() => prisma.$disconnect());