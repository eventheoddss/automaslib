const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Philosophy"},
                { name: "Fiction"},
                { name: "Science"},
                { name: "Literature"},
                { name: "Art"},
            ]
        });
        console.log("Success")
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        await database.$disconnect();
    }
}

main();