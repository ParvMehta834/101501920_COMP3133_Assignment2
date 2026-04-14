function ok(message, data = null) {
  return { success: true, message, data, error: null };
}

function fail(message, error = null) {
  return { success: false, message, data: null, error };
}

module.exports = { ok, fail };