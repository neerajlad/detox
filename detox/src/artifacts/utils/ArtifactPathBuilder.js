const path = require('path');
const constructSafeFilename = require('../../utils/constructSafeFilename');

class ArtifactPathBuilder {
  constructor({
    artifactsRootDir,
    getUniqueSubdirectory = ArtifactPathBuilder.generateTimestampBasedSubdirectoryName
  }) {
    this._currentTestRunDir = path.join(artifactsRootDir, getUniqueSubdirectory());
  }

  get rootDir() {
    return this._currentTestRunDir;
  }

  buildPathForTestArtifact(artifactName, testSummary = null) {
    if (!testSummary) {
      return this._buildPathForRunArtifact(artifactName);
    }

    const testArtifactPath = path.join(
      this._currentTestRunDir,
      this._constructDirectoryNameForCurrentRunningTest(testSummary),
      constructSafeFilename('', artifactName),
    );

    return testArtifactPath;
  }

  _buildPathForRunArtifact(artifactName) {
    return path.join(
      this._currentTestRunDir,
      constructSafeFilename('', artifactName),
    );
  }

  _constructDirectoryNameForCurrentRunningTest(testSummary) {
    const testDirectoryPrefix = this._buildTestDirectoryPrefix(testSummary);
    const testArtifactsDirname = constructSafeFilename(testDirectoryPrefix, testSummary.fullName);

    return testArtifactsDirname;
  }

  _buildTestDirectoryPrefix(testSummary) {
    return this._getStatusSign(testSummary);
  }

  _getStatusSign(testSummary) {
    switch (testSummary.status) {
      case 'passed': return '✓ ';
      case 'failed': return '✗ ';
      default: return '';
    }
  }
}

ArtifactPathBuilder.generateTimestampBasedSubdirectoryName = () => `detox_artifacts.${new Date().toISOString()}`;

module.exports = ArtifactPathBuilder;