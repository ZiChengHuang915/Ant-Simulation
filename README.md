# Ant-Simulation

This is inspired by a project made by Sebastian Lague: [Coding Adventure: Ant and Slime Simulations](https://www.youtube.com/watch?v=X-iSQQgOd1A&t=322s&ab_channel=SebastianLague). Check it out [here](https://zichenghuang915.github.io/Ant-Simulation/index.html).

![Demo](./images/demo.gif)

The simulation follows several heuristics: 

- Ants spawn out of the colony (brown) and aim to find food to bring back to the colony (green).
- Ants randomly explore the area. If they hit the border, they will bounce back immediately.
- While exploring, ants secrete a pheromone a pheromone (blue) that helps guide them home if they have found food. In real life, they use other methods in addition, such as the sun or certain landmarks on the ground.
- If they find food, they secrete a different pheromone to let other ants know of their path (red), and try to find their way home.
- Pheromones evaporate over time.
- While other ants do not have food (exploring), they will try to follow red pheromones because it is more likely to find food if they follow this trail than to randomly explore.

Over time, this lets the ant colony generate the shortest path to a food source. Because pheromones evaporate over time, less optimal paths will be walked on less, and ants will gravitate towards paths that are more travelled. Iteratively, this produces the optimal path.

If many food sources are present, this is an abstraction of a local search algorithm to solve the [travelling salesman problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem), where the colony is the origin node, and the food source is all the nodes that have to be visitied.

There are several papers published on this niche topic:
- [Ant colonies for the travelling salesman problem](https://www.sciencedirect.com/science/article/abs/pii/S0303264797017085?via%3Dihub)
- [The generalized traveling salesman problem solved with ant algorithms](https://casmodeling.springeropen.com/articles/10.1186/s40294-017-0048-9)
- [Solving Traveling Salesmen Problem using Ant Colony Optimization
Algorithm](https://www.hilarispublisher.com/open-access/solving-traveling-salesmen-problem-using-ant-colony-optimizationalgorithm-2168-9679-1000260.pdf)