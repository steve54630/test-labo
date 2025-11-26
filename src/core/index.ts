import Laboratory from "../models/laboratory";
// Exemple de données JSON
import rawData from "../data/easy.json";

async function main() {
  const lab = Laboratory.fromRaw(rawData);

  console.log("filtered by priority", lab.returnSampleByPriority());

  console.log(lab.planifyLab());
}

main().catch(console.error);
