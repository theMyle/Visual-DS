import { ChallengeConfig, API_TEMPLATE } from "./runner";

export const CHALLENGE_1: ChallengeConfig = {
  id: "queue-1",
  title: "Queue Rotation",
  description:
    "Given a queue, rotate it left by one position using queue operations and return the new front. Example: [1, 2, 3] => 2.",
  programStructure: {
    parameterNames: ["queue", "io"],
  },
  initialEditorCode: `${API_TEMPLATE}

function Solution(queue, io) {
  if (queue.size() === 0) {
    io.println("Queue is empty");
    return 0;
  }

  const front = queue.dequeue();
  queue.enqueue(front);

  io.println("Rotated front: " + front);
  return queue.peek();
}

`,
  testCases: [
    {
      name: "Test Case 1",
      input: [1, 2, 3],
      expectedReturn: 2,
    },
    {
      name: "Test Case 2",
      input: [4, 5, 6, 7],
      expectedReturn: 5,
    },
    {
      name: "Test Case 3",
      input: [9],
      expectedReturn: 9,
    },
    {
      name: "Test Case 4",
      input: [],
      expectedReturn: 0,
    },
  ],
  maxCapacity: {
    desktop: 40,
    mobile: 20,
  },
};
