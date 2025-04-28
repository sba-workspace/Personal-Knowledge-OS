-- Install pgvector extension if missing
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "tags" TEXT[],
    "embedding" vector(384),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NoteLinks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Note_tags_idx" ON "Note"("tags");

-- CreateIndex
CREATE UNIQUE INDEX "_NoteLinks_AB_unique" ON "_NoteLinks"("A", "B");

-- CreateIndex
CREATE INDEX "_NoteLinks_B_index" ON "_NoteLinks"("B");

-- AddForeignKey
ALTER TABLE "_NoteLinks" ADD CONSTRAINT "_NoteLinks_A_fkey" FOREIGN KEY ("A") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteLinks" ADD CONSTRAINT "_NoteLinks_B_fkey" FOREIGN KEY ("B") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
