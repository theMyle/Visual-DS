import { ChallengeConfig } from "./runner";
import { CHALLENGE_1 } from "./challenge-1";
import { CHALLENGE_2 } from "./challenge-2";

export const CHALLENGE_REGISTRY: Record<string, ChallengeConfig> = {
  "challenge-1": CHALLENGE_1,
  "challenge-2": CHALLENGE_2,
};
