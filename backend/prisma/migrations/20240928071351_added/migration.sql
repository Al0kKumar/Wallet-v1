-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('WALLET_TO_WALLET', 'BANK_TO_WALLET', 'WALLET_TO_BANK');

-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,
    "senderId" INTEGER,
    "receiverId" INTEGER,
    "bank" TEXT,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
