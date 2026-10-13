import assert from "node:assert/strict";
import { grammarTopics, topicForLesson } from "../src/data/grammar.js";
import { grammarLessons } from "../src/data/grammarLessons.js";
import { grammarQuestions, grammarQuestionsForLesson } from "../src/data/grammarPractice.js";

for (const topic of grammarTopics) {
  const lesson = grammarLessons[topic.id];
  assert.ok(lesson, `Missing lesson: ${topic.id}`);
  assert.ok(lesson.intro.length > 80, `Intro too short: ${topic.id}`);
  assert.ok(lesson.sections.length >= 4, `Not enough teaching sections: ${topic.id}`);
  assert.ok(lesson.sections.every((section) => section.length === 3 && section[1].length > 100 && section[2].length > 20), `Incomplete section: ${topic.id}`);
  assert.ok(lesson.summary.length >= 3, `Missing short summary: ${topic.id}`);

  const questions = grammarQuestions(topic.id);
  assert.equal(questions.length, 20, `Wrong question count: ${topic.id}`);
  assert.equal(new Set(questions.map((question) => question.prompt)).size, 20, `Duplicate prompts: ${topic.id}`);
  for (const question of questions) {
    assert.ok(question.prompt.includes("___"), `Missing blank: ${topic.id}/${question.id}`);
    assert.equal(new Set(question.options).size, 4, `Duplicate options: ${topic.id}/${question.id}`);
    assert.ok(question.options.includes(question.correct), `Missing answer: ${topic.id}/${question.id}`);
    assert.ok(question.explanation.length > 20, `Missing explanation: ${topic.id}/${question.id}`);
  }
}

for (let day = 1; day <= 42; day += 1) {
  const topic = topicForLesson(day);
  if (!topic) continue;
  const questions = grammarQuestionsForLesson(topic);
  assert.equal(questions.length, 20, `Wrong Erasmus grammar count: day ${day}`);
  assert.equal(new Set(questions.map((question) => question.id)).size, 20, `Duplicate IDs: day ${day}`);
}

console.log(`Checked ${grammarTopics.length} grammar lessons, ${grammarTopics.length * 20} library questions and all Erasmus grammar days.`);
