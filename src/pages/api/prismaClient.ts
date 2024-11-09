// prismaClient.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();
export default prisma;

let disconnectTimeout: NodeJS.Timeout;

export async function someDatabaseOperation<T>(operation: () => Promise<T>): Promise<T> {
    const result = await operation();

    // Effacer le précédent délai s'il existe
    if (disconnectTimeout) {
        clearTimeout(disconnectTimeout);
    }

    // Fermer la connexion après un délai de 30 secondes (ou tout autre délai de votre choix)
    disconnectTimeout = setTimeout(() => {
        prisma.$disconnect();
    }, 30000);

    return result;
}
