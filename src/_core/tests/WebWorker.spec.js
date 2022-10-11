/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from "chai";
import * as appStrings from "_core/constants/appStrings";
import { webWorkerState } from "_core/reducers/models/webWorker";
import TestUtil from "_core/tests/TestUtil";

export const WebWorkerSpec = {
    name: "WebWorkerSpec",
    tests: {
        default: {
            test1: () => {
                it("The state model creates a worker manager that defaults to having no workers active", function(done) {
                    if (TestUtil.skipIfNoWebGL("WebWorkerSpec.default.test1", this, done)) {
                        return;
                    }
                    let manager = webWorkerState.get("workerManager");
                    const total = manager.workersTotal();
                    const available = manager.workersAvailable();
                    const expected = 0;
                    expect(total).to.equal(expected);
                    expect(available).to.equal(expected);

                    done();
                });
            },
            test2: () => {
                it("Can create and clear workers", function(done) {
                    if (TestUtil.skipIfNoWebGL("WebWorkerSpec.default.test2", this, done)) {
                        return;
                    }
                    let manager = webWorkerState.get("workerManager");
                    let numWorkers = 2;

                    expect(manager.workersTotal()).to.equal(0);
                    expect(manager.workersAvailable()).to.equal(0);

                    manager.createWorkers(numWorkers);
                    expect(manager.workersTotal()).to.equal(numWorkers);
                    expect(manager.workersAvailable()).to.equal(numWorkers);

                    manager.clearWorkers();
                    expect(manager.workersTotal()).to.equal(0);
                    expect(manager.workersAvailable()).to.equal(0);

                    done();
                });
            },
            test3: () => {
                it("Queue up jobs for workers", function(done) {
                    if (TestUtil.skipIfNoWebGL("WebWorkerSpec.default.test3", this, done)) {
                        return;
                    }
                    let numWorkers = 2;
                    let numTasks = 200;
                    let delay = 200;
                    this.timeout(numTasks * delay / numWorkers + 500); // add buffer to expected execution time

                    let manager = webWorkerState.get("workerManager");
                    manager.createWorkers(numWorkers);

                    let promiseArr = [];
                    for (let i = 0; i < numTasks; i++) {
                        promiseArr.push(
                            manager.queueJob({
                                operation: appStrings.WORKER_TASK_TEST,
                                delay: delay,
                                data: i
                            })
                        );
                    }
                    expect(manager.workersTotal()).to.equal(numWorkers);
                    expect(manager.workersAvailable()).to.equal(0);

                    Promise.all(promiseArr)
                        .then(
                            data => {
                                expect(manager.workersTotal()).to.equal(numWorkers);
                                expect(manager.workersAvailable()).to.equal(numWorkers);
                                manager.clearWorkers();
                            },
                            err => {
                                expect(0).to.equal(1);
                            }
                        )
                        .finally(done);
                });
            }
        }
    }
};
