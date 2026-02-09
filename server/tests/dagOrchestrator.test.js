const DagOrchestrator = require('../services/dagOrchestrator');

describe('DagOrchestrator Test Suite', () => {
  test('Correctly orders sequential nodes without dependencies', () => {
    const nodes = [
      { id: 'nodeA', dependencies: [] },
      { id: 'nodeB', dependencies: ['nodeA'] },
      { id: 'nodeC', dependencies: ['nodeB'] }
    ];

    const stages = DagOrchestrator.planExecutionStages(nodes);
    expect(stages).toHaveLength(3);
    expect(stages[0]).toEqual(['nodeA']);
    expect(stages[1]).toEqual(['nodeB']);
    expect(stages[2]).toEqual(['nodeC']);
  });

  test('Identifies parallel branches for independent stages', () => {
    const nodes = [
      { id: 'root', dependencies: [] },
      { id: 'branchLeft', dependencies: ['root'] },
      { id: 'branchRight', dependencies: ['root'] },
      { id: 'merge', dependencies: ['branchLeft', 'branchRight'] }
    ];

    const stages = DagOrchestrator.planExecutionStages(nodes);
    expect(stages).toHaveLength(3);
    expect(stages[0]).toEqual(['root']);
    expect(stages[1]).toContain('branchLeft');
    expect(stages[1]).toContain('branchRight');
    expect(stages[2]).toEqual(['merge']);
  });

  test('Throws exception on cyclic dependency graph', () => {
    const cyclicNodes = [
      { id: 'cycleA', dependencies: ['cycleB'] },
      { id: 'cycleB', dependencies: ['cycleA'] }
    ];

    expect(() => {
      DagOrchestrator.planExecutionStages(cyclicNodes);
    }).toThrow(/Cyclic dependency detected/);
  });

  test('Throws exception if node points to non-existent parent dependency', () => {
    const brokenNodes = [
      { id: 'step1', dependencies: ['ghostNode'] }
    ];

    expect(() => {
      DagOrchestrator.planExecutionStages(brokenNodes);
    }).toThrow(/non-existent node/);
  });
});
