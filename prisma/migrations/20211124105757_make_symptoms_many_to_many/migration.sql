-- CreateTable
CREATE TABLE "_ConditionToSymptom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConditionToSymptom_AB_unique" ON "_ConditionToSymptom"("A", "B");

-- CreateIndex
CREATE INDEX "_ConditionToSymptom_B_index" ON "_ConditionToSymptom"("B");

-- AddForeignKey
ALTER TABLE "_ConditionToSymptom" ADD FOREIGN KEY ("A") REFERENCES "Condition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConditionToSymptom" ADD FOREIGN KEY ("B") REFERENCES "Symptom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
