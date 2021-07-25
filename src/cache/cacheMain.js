let cache = {};

cache.lastLog = {
    version: 1.0,
    data: new Map(),
    lastRecordedTime: "Not Recorded",
    lastStoredId: 0,
    lastRecordedLogCheck: "Not Recorded",
    nextLogCheck: Date.now() + 120000
}

module.exports = cache;