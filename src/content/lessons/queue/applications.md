---
title: Queue Applications
---

# Queue Applications

Since a queue maintains FIFO order, its primary use case is in any scenario where fairness and "**first-come, first-served**" logic are required to manage a high volume of requests.

## McDonald's Order Queue

In a modern McDonald's, the **order queue** acts as the essential bridge between the customer and the kitchen. When a customer pays at a kiosk, the system performs an **enqueue** operation to send the order to the back of the kitchen's digital queue. The staff **peeks** at the front of the queue to see what's next, then **dequeues** it to begin preparation. Once the meal is finished and served at the counter, the system moves to the next order in the exact sequence it was received. This ensures the staff works in order and prevents newer requests from jumping ahead of those waiting longer.

![McDonalds Simplified Order Queue System](/lessons/queue/application1.png)

## Online Match Making

**Online Game Matchmaking** In competitive games like League of Legends, queues are the backbone of the player experience. When you click "Find Match," you are placed into a matchmaking queue where an algorithm runs checks based on your rank to find an eligible pool of players. As more players are found, they are **enqueued** into specific slots until the required capacity for a match is met. Once the queue is full and the ranks are balanced, the system "pops" the queue to start the game instance. This preserves the temporal order of the lobby, ensuring that players who have been waiting the longest are the first ones placed into a starting match.

![Simplified Matchmaking System](/lessons/queue/application2.png)
