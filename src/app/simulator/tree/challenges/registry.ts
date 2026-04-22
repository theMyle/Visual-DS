import { ChallengeConfig } from "./runner";
import { CHALLENGE_1 } from "./challenge-1";

export const CHALLENGE_REGISTRY: Record<string, ChallengeConfig> = {
  [CHALLENGE_1.id]: CHALLENGE_1,
};
