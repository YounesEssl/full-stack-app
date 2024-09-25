import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Remplacez 1 par l'ID de l'utilisateur par défaut ou existant dans votre base de données
  const defaultUserId = 1; 

  await prisma.survey.updateMany({
    data: {
      userId: defaultUserId,
    },
    where: {
      userId: null, // Mettez à jour uniquement les enregistrements sans userId
    },
  });
  
  console.log("Les sondages existants ont été mis à jour avec un userId.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
