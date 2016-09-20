import PatchrUi from './PatchrUi';

module.exports = function (options) {
  return new PatchrUi(options);
};

module.exports.__version__ = PatchrUi.__version__;
module.exports.defaults = PatchrUi.defaults;
module.exports.PatchrUi = PatchrUi;
