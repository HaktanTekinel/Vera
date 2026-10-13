// Editorial review: print each cloze with its intended answer inserted.
// Usage: node scripts/reviewGrammarQuestions.mjs A1
//        node scripts/reviewGrammarQuestions.mjs have-got
import { grammarTopics } from "../src/data/grammar.js";
import { grammarQuestions } from "../src/data/grammarPractice.js";

const selection = process.argv[2];
const topics = grammarTopics.filter((topic) => topic.level === selection || topic.id === selection);

if (!topics.length) {
  console.error("Kullanım: node scripts/reviewGrammarQuestions.mjs <A1|A2|B1|B2|C1|konu-id>");
  process.exitCode = 1;
} else {
  for (const topic of topics) {
    console.log(`\n${topic.level} · ${topic.title} (${topic.id})`);
    for (const question of grammarQuestions(topic.id)) {
      const answer = question.correct === "—" ? "" : question.correct;
      console.log(`${String(question.id).padStart(2, "0")}. ${question.prompt.replace("___", answer).replace(/\s+/g, " ").trim()}`);
    }
  }
}
